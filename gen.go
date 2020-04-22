package main

import (
	"encoding/json"
	"io/ioutil"
	"regexp"
	"strings"
)

func main() {
	fileBytes, err := ioutil.ReadFile("program.txt")
	if err != nil {
		panic(err)
	}

	packages := ProcessProgram(string(fileBytes))

	programJSON, err := json.MarshalIndent(packages, "", "  ")
	if err != nil {
		panic(err)
	}

	programJS := []byte("const packages = ")
	programJS = append(programJS, programJSON...)
	programJS = append(programJS, []byte(";\n")...)

	err = ioutil.WriteFile("web/program.js", programJS, 0644)
	if err != nil {
		panic(err)
	}
}

var packageDelimiterRE = regexp.MustCompile("(?m)^---+$")
var funcDefRE = regexp.MustCompile("^func (?P<receiver>\\([a-zA-Z]+ \\*?\\[\\[(?P<receiverType>[a-zA-Z]+)[^\\]]+\\]\\]\\) )?((?P<funcName>[a-zA-Z]+)|\\[\\[(?P<funcNameTagged>[a-zA-Z]+)[^\\]]+\\]\\])")

const funcDefReceiverTypeIndex = 2
const funcDefPlainNameIndex = 4
const funcDefTaggedNameIndex = 5

type Package struct {
	Name    string `json:"name"`
	Imports string `json:"imports"`
	Vars    []Var  `json:"vars"`
	Types   []Type `json:"types"`
	Funcs   []Func `json:"funcs"`

	Text string `json:"text"`
}

type Var struct {
	Sort int    `json:"sort"`
	Name string `json:"name"`

	Text string `json:"text"`
}

type Type struct {
	Sort        int    `json:"sort"`
	Name        string `json:"name"`
	IsInterface bool   `json:"isInterface"`

	Text string `json:"text"`
}

type Func struct {
	Sort         int    `json:"sort"`
	Name         string `json:"name"`
	ReceiverType string `json:"receiverType"`

	Text string `json:"text"`
}

func ProcessProgram(program string) []Package {
	var packages []Package

	packageTexts := packageDelimiterRE.Split(program, -1)

	for _, packageText := range packageTexts {
		packageText = strings.TrimSpace(packageText)

		var p Package

		lines := strings.Split(packageText, "\n")
		lineIndexNext := 0
		textBuilder := strings.Builder{}

		nextLine := func() string {
			line := lines[lineIndexNext]
			textBuilder.WriteString(line + "\n")
			lineIndexNext++
			return line
		}

		for lineIndexNext < len(lines) {
			line := nextLine()

			if strings.TrimSpace(line) == "" {
				continue
			} else if strings.HasPrefix(line, "package") {
				p.Name = strings.TrimPrefix(line, "package ")
			} else if strings.HasPrefix(line, "import") {
				importBuilder := strings.Builder{}
				importBuilder.WriteString(line + "\n")
				for {
					importLine := nextLine()
					importBuilder.WriteString(importLine + "\n")
					if strings.HasPrefix(importLine, ")") {
						break
					}
				}
				p.Imports = importBuilder.String()
			} else if strings.HasPrefix(line, "var") {
				pieces := strings.Split(line, " ")

				varBuilder := strings.Builder{}
				varBuilder.WriteString(line + "\n")

				for {
					varLine := nextLine()
					if strings.TrimSpace(varLine) == "" {
						break
					}
					varBuilder.WriteString(varLine + "\n")
				}

				p.Vars = append(p.Vars, Var{
					Sort: lineIndexNext,
					Name: pieces[1],
					Text: varBuilder.String(),
				})
			} else if strings.HasPrefix(line, "type") {
				pieces := strings.Split(line, " ")

				typeBuilder := strings.Builder{}
				typeBuilder.WriteString(line + "\n")

				for {
					typeLine := nextLine()
					typeBuilder.WriteString(typeLine + "\n")
					if typeLine == "}" {
						break
					}
				}

				isInterface := false
				if pieces[2] == "interface" {
					isInterface = true
				}

				p.Types = append(p.Types, Type{
					Sort:        lineIndexNext,
					Name:        pieces[1],
					IsInterface: isInterface,
					Text:        typeBuilder.String(),
				})
			} else if strings.HasPrefix(line, "func") {
				pieces := funcDefRE.FindStringSubmatch(line)

				funcBuilder := strings.Builder{}
				funcBuilder.WriteString(line + "\n")

				for {
					funcLine := nextLine()
					funcBuilder.WriteString(funcLine + "\n")
					if funcLine == "}" {
						break
					}
				}

				name := pieces[funcDefPlainNameIndex]
				if name == "" {
					name = pieces[funcDefTaggedNameIndex]
				}

				p.Funcs = append(p.Funcs, Func{
					Sort:         lineIndexNext,
					Name:         name,
					ReceiverType: pieces[funcDefReceiverTypeIndex],
					Text:         funcBuilder.String(),
				})
			}
		}

		p.Text = textBuilder.String()

		packages = append(packages, p)
	}

	return packages
}

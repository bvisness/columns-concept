const packages = [
  {
    "name": "util",
    "imports": "import (\n\t\"http\"\n\t\"io\"\n)\n",
    "notes": "",
    "vars": null,
    "types": null,
    "funcs": [
      {
        "sort": 11,
        "name": "WriteStringAndCode",
        "receiverType": "",
        "text": "func WriteStringAndCode(w http.ResponseWriter, code int, s string) {\n\tw.WriteHeader(code)\n\tio.WriteString(w, s)\n}\n"
      }
    ],
    "text": "package util\n\nimport (\n\t\"http\"\n\t\"io\"\n)\n\nfunc WriteStringAndCode(w http.ResponseWriter, code int, s string) {\n\tw.WriteHeader(code)\n\tio.WriteString(w, s)\n}\n"
  },
  {
    "name": "db",
    "imports": "import (\n\t\"encoding/json\"\n\t\"errors\"\n\t\"io/ioutil\"\n\t\"log\"\n\t\"time\"\n)\n",
    "notes": "",
    "vars": [
      {
        "sort": 12,
        "name": "NotFound",
        "text": "var NotFound = errors.New(\"resource not found\")\n"
      },
      {
        "sort": 91,
        "name": "testPeople",
        "text": "var testPeople = map[string]*[[Person / type Person]]{\n\t\"Alice\": \u0026[[Person / type Person]]{\n\t\tName: \"Alice\",\n\t\tBirthday: time.Date(1970, time.January, 1, 0, 0, 0, 0, time.UTC),\n\t},\n\t\"Bob\": \u0026[[Person / type Person]]{\n\t\tName: \"Bob\",\n\t\tBirthday: time.Date(2000, time.April, 4, 0, 0, 0, 0, time.UTC),\n\t},\n}\n"
      }
    ],
    "types": [
      {
        "sort": 16,
        "name": "Person",
        "isInterface": false,
        "implements": null,
        "text": "type Person struct {\n\tName     string    `json:\"name\"`\n\tBirthday time.Time `json:\"birthday\"`\n}\n"
      },
      {
        "sort": 25,
        "name": "PersonDB",
        "isInterface": true,
        "implements": null,
        "text": "type PersonDB interface {\n\tGetPerson(name string) (*[[Person / type Person]], error)\n\tPutPerson(person *[[Person / type Person]])\n}\n"
      },
      {
        "sort": 29,
        "name": "fileDb",
        "isInterface": false,
        "implements": [
          "PersonDB"
        ],
        "text": "type fileDb struct \u003c\u003cPersonDB\u003e\u003e {\n\tPath string\n}\n"
      },
      {
        "sort": 79,
        "name": "testDb",
        "isInterface": false,
        "implements": [
          "PersonDB"
        ],
        "text": "type testDb struct \u003c\u003cPersonDB\u003e\u003e {\n\t// nothing needed\n}\n"
      }
    ],
    "funcs": [
      {
        "sort": 20,
        "name": "Age",
        "receiverType": "Person",
        "text": "func (p *[[Person / type Person]]) Age() int {\n\treturn int(time.Now().Sub(p.[[Birthday / type Person]]).Hours() / 24)\n}\n"
      },
      {
        "sort": 35,
        "name": "NewFileBackedPersonDB",
        "receiverType": "",
        "text": "func NewFileBackedPersonDB(filepath string) [[PersonDB / type PersonDB]] {\n\treturn [[fileDb / type fileDb]]{\n\t\tPath: filepath\n\t}\n}\n"
      },
      {
        "sort": 45,
        "name": "GetPerson",
        "receiverType": "fileDb",
        "text": "func (db *[[fileDb / type fileDb]]) [[GetPerson / type PersonDB]](name string) (*[[Person / type Person]], error) {\n\tpeople := db.[[loadFile / func fileDb:loadFile]]()\n\n\tif person, exists := people[name]; exists {\n\t\treturn person, nil\n\t} else {\n\t\treturn nil, [[NotFound / var NotFound]]\n\t}\n}\n"
      },
      {
        "sort": 60,
        "name": "PutPerson",
        "receiverType": "fileDb",
        "text": "func (db *[[fileDb / type fileDb]]) [[PutPerson / type PersonDB]](person *[[Person / type Person]]) {\n\tpeople := db.[[loadFile / func fileDb:loadFile]]()\n\tpeople[person.Name] = person\n\n\tpeopleJson, err := json.Marshal(people)\n\tif err != nil {\n\t\tlog.Fatalf(\"failed to marshal people to JSON: %v\", err)\n\t}\n\n\terr := ioutil.WriteFile(db.[[Path / type fileDb]], peopleJson, 0644)\n\tif err != nil {\n\t\tlog.Fatalf(\"failed to save people db file: %v\", err)\n\t}\n}\n"
      },
      {
        "sort": 75,
        "name": "loadFile",
        "receiverType": "fileDb",
        "text": "func (db *[[fileDb / type fileDb]]) loadFile() map[string]*[[Person / type Person]] {\n\tfileBytes, err := ioutil.ReadAll(db.[[Path / type fileDb]])\n\tif err != nil {\n\t\tlog.Fatalf(\"failed to read person db file: %v\", err)\n\t}\n\n\tvar people map[string]*[[Person / type Person]]\n\terr := json.Unmarshal(fileBytes, \u0026people)\n\tif err != nil {\n\t\tlog.Fatalf(\"person db file contained invalid JSON: %v\", err)\n\t}\n\n\treturn people\n}\n"
      },
      {
        "sort": 98,
        "name": "GetPerson",
        "receiverType": "testDb",
        "text": "func (db *[[testDb / type testDb]]) [[GetPerson / type PersonDB]](name string) (*[[Person / type Person]], error) {\n\tif person, exists := testPeople[name]; exists {\n\t\treturn person, nil\n\t} else {\n\t\treturn nil, [[NotFound / var NotFound]]\n\t}\n}\n"
      },
      {
        "sort": 102,
        "name": "PutPerson",
        "receiverType": "testDb",
        "text": "func (db *[[testDb / type testDb]]) [[PutPerson / type PersonDB]](person *[[Person / type Person]]) {\n\t// not implemented for testing\n}\n"
      }
    ],
    "text": "package db\n\nimport (\n\t\"encoding/json\"\n\t\"errors\"\n\t\"io/ioutil\"\n\t\"log\"\n\t\"time\"\n)\n\nvar NotFound = errors.New(\"resource not found\")\n\ntype Person struct {\n\tName     string    `json:\"name\"`\n\tBirthday time.Time `json:\"birthday\"`\n}\n\nfunc (p *[[Person / type Person]]) Age() int {\n\treturn int(time.Now().Sub(p.[[Birthday / type Person]]).Hours() / 24)\n}\n\ntype PersonDB interface {\n\tGetPerson(name string) (*[[Person / type Person]], error)\n\tPutPerson(person *[[Person / type Person]])\n}\n\ntype fileDb struct \u003c\u003cPersonDB\u003e\u003e {\n\tPath string\n}\n\nfunc NewFileBackedPersonDB(filepath string) [[PersonDB / type PersonDB]] {\n\treturn [[fileDb / type fileDb]]{\n\t\tPath: filepath\n\t}\n}\n\nfunc (db *[[fileDb / type fileDb]]) [[GetPerson / type PersonDB]](name string) (*[[Person / type Person]], error) {\n\tpeople := db.[[loadFile / func fileDb:loadFile]]()\n\n\tif person, exists := people[name]; exists {\n\t\treturn person, nil\n\t} else {\n\t\treturn nil, [[NotFound / var NotFound]]\n\t}\n}\n\nfunc (db *[[fileDb / type fileDb]]) [[PutPerson / type PersonDB]](person *[[Person / type Person]]) {\n\tpeople := db.[[loadFile / func fileDb:loadFile]]()\n\tpeople[person.Name] = person\n\n\tpeopleJson, err := json.Marshal(people)\n\tif err != nil {\n\t\tlog.Fatalf(\"failed to marshal people to JSON: %v\", err)\n\t}\n\n\terr := ioutil.WriteFile(db.[[Path / type fileDb]], peopleJson, 0644)\n\tif err != nil {\n\t\tlog.Fatalf(\"failed to save people db file: %v\", err)\n\t}\n}\n\nfunc (db *[[fileDb / type fileDb]]) loadFile() map[string]*[[Person / type Person]] {\n\tfileBytes, err := ioutil.ReadAll(db.[[Path / type fileDb]])\n\tif err != nil {\n\t\tlog.Fatalf(\"failed to read person db file: %v\", err)\n\t}\n\n\tvar people map[string]*[[Person / type Person]]\n\terr := json.Unmarshal(fileBytes, \u0026people)\n\tif err != nil {\n\t\tlog.Fatalf(\"person db file contained invalid JSON: %v\", err)\n\t}\n\n\treturn people\n}\n\ntype testDb struct \u003c\u003cPersonDB\u003e\u003e {\n\t// nothing needed\n}\n\nvar testPeople = map[string]*[[Person / type Person]]{\n\t\"Alice\": \u0026[[Person / type Person]]{\n\t\tName: \"Alice\",\n\t\tBirthday: time.Date(1970, time.January, 1, 0, 0, 0, 0, time.UTC),\n\t},\n\t\"Bob\": \u0026[[Person / type Person]]{\n\t\tName: \"Bob\",\n\t\tBirthday: time.Date(2000, time.April, 4, 0, 0, 0, 0, time.UTC),\n\t},\n}\n\nfunc (db *[[testDb / type testDb]]) [[GetPerson / type PersonDB]](name string) (*[[Person / type Person]], error) {\n\tif person, exists := testPeople[name]; exists {\n\t\treturn person, nil\n\t} else {\n\t\treturn nil, [[NotFound / var NotFound]]\n\t}\n}\n\nfunc (db *[[testDb / type testDb]]) [[PutPerson / type PersonDB]](person *[[Person / type Person]]) {\n\t// not implemented for testing\n}\n"
  },
  {
    "name": "greet",
    "imports": "import (\n\t\"fmt\"\n\t\"io/ioutil\"\n\t\"log\"\n\t\"net/http\"\n\n\t[[\"github.com/bvisness/columns-concept/db\" / package db]]\n\t[[\"github.com/bvisness/columns-concept/util\" / package util]]\n)\n",
    "notes": "",
    "vars": null,
    "types": null,
    "funcs": [
      {
        "sort": 35,
        "name": "GreetHandler",
        "receiverType": "",
        "text": "func GreetHandler(people [[db / package db]].[[PersonDB / type db.PersonDB]]) http.HandlerFunc {\n\treturn func(w http.ResponseWriter, req *http.Request) {\n\t\tname, err := ioutil.ReadAll(req.Body)\n\t\tif err != nil {\n\t\t\tlog.Printf(\"error reading name: %v\", err)\n\t\t\tw.WriteHeader(http.StatusInternalServerError)\n\t\t\treturn\n\t\t}\n\n\t\t_, err := people.[[GetPerson / type db.PersonDB]](name)\n\t\tif err != nil {\n\t\t\tif errors.Is(err, [[db / package db]].[[NotFound / var db.NotFound]]) {\n\t\t\t\t[[util / package util]].[[WriteStringAndCode / func util.WriteStringAndCode]](w, http.StatusNotFound, \"you don't exist\\n\")\n\t\t\t} else {\n\t\t\t\tlog.Printf(\"error getting person from database: %v\", err)\n\t\t\t\tw.WriteHeader(http.StatusInternalServerError)\n\t\t\t}\n\t\t\treturn\n\t\t}\n\n\t\t[[util / package util]].[[WriteStringAndCode / func util.WriteStringAndCode]](w, http.StatusOK, fmt.Sprintf(\"Hello, %s!\\n\", string(name)))\n\t}\n}\n"
      }
    ],
    "text": "package greet\n\nimport (\n\t\"fmt\"\n\t\"io/ioutil\"\n\t\"log\"\n\t\"net/http\"\n\n\t[[\"github.com/bvisness/columns-concept/db\" / package db]]\n\t[[\"github.com/bvisness/columns-concept/util\" / package util]]\n)\n\nfunc GreetHandler(people [[db / package db]].[[PersonDB / type db.PersonDB]]) http.HandlerFunc {\n\treturn func(w http.ResponseWriter, req *http.Request) {\n\t\tname, err := ioutil.ReadAll(req.Body)\n\t\tif err != nil {\n\t\t\tlog.Printf(\"error reading name: %v\", err)\n\t\t\tw.WriteHeader(http.StatusInternalServerError)\n\t\t\treturn\n\t\t}\n\n\t\t_, err := people.[[GetPerson / type db.PersonDB]](name)\n\t\tif err != nil {\n\t\t\tif errors.Is(err, [[db / package db]].[[NotFound / var db.NotFound]]) {\n\t\t\t\t[[util / package util]].[[WriteStringAndCode / func util.WriteStringAndCode]](w, http.StatusNotFound, \"you don't exist\\n\")\n\t\t\t} else {\n\t\t\t\tlog.Printf(\"error getting person from database: %v\", err)\n\t\t\t\tw.WriteHeader(http.StatusInternalServerError)\n\t\t\t}\n\t\t\treturn\n\t\t}\n\n\t\t[[util / package util]].[[WriteStringAndCode / func util.WriteStringAndCode]](w, http.StatusOK, fmt.Sprintf(\"Hello, %s!\\n\", string(name)))\n\t}\n}\n"
  },
  {
    "name": "birthday",
    "imports": "import (\n\t\"errors\"\n\t\"fmt\"\n\t\"io/ioutil\"\n\t\"log\"\n\t\"net/http\"\n\t\"time\"\n\n\t[[\"github.com/bvisness/columns-concept/db\" / package db]]\n\t[[\"github.com/bvisness/columns-concept/util\" / package util]]\n)\n",
    "notes": "",
    "vars": null,
    "types": null,
    "funcs": [
      {
        "sort": 49,
        "name": "BirthdayHandler",
        "receiverType": "",
        "text": "func BirthdayHandler(people [[db / package db]].[[PersonDB / type db.PersonDB]]) http.HandlerFunc {\n\treturn func(w http.ResponseWriter, req *http.Request) {\n\t\tname, err := ioutil.ReadAll(req.Body)\n\t\tif err != nil {\n\t\t\tlog.Printf(\"error reading name: %v\", err)\n\t\t\tw.WriteHeader(http.StatusInternalServerError)\n\t\t\treturn\n\t\t}\n\n\t\tperson, err := people.[[GetPerson / type db.PersonDB]](name)\n\t\tif err != nil {\n\t\t\tif errors.Is(err, [[db / package db]].[[NotFound / var db.NotFound]]) {\n\t\t\t\t[[util / package util]].[[WriteStringAndCode / func util.WriteStringAndCode]](w, http.StatusNotFound, \"you don't exist\\n\")\n\t\t\t} else {\n\t\t\t\tlog.Printf(\"error getting person from database: %v\", err)\n\t\t\t\tw.WriteHeader(http.StatusInternalServerError)\n\t\t\t}\n\t\t\treturn\n\t\t}\n\n\t\tvar message string\n\n\t\t_, nowMonth, nowDay := time.Now().Date()\n\t\t_, birthdayMonth, birthdayDay := person.[[Birthday / type db.Person]].Date()\n\n\t\tif nowMonth == birthdayMonth \u0026\u0026 nowDay == birthdayDay {\n\t\t\tmessage = fmt.Sprintf(\"Happy birthday, %s! Today is a special day. Congrats on turning %d, and best wishes for the coming year!\\n\", person.[[Name / type db.Person]], person.[[Age / func db.Person:Age]]())\n\t\t} else {\n\t\t\tdaysUntilBirthday := (person.[[Birthday / type db.Person]].YearDay() - time.Now().YearDay()) % 365\n\t\t\tmessage = fmt.Sprintf(\"It's not your birthday yet, but only %d days to go!\\n\", daysUntilBirthday)\n\t\t}\n\n\t\t[[util / package util]].[[WriteStringAndCode / func util.WriteStringAndCode]](w, http.StatusOK, message)\n\t}\n}\n"
      }
    ],
    "text": "package birthday\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n\t\"io/ioutil\"\n\t\"log\"\n\t\"net/http\"\n\t\"time\"\n\n\t[[\"github.com/bvisness/columns-concept/db\" / package db]]\n\t[[\"github.com/bvisness/columns-concept/util\" / package util]]\n)\n\nfunc BirthdayHandler(people [[db / package db]].[[PersonDB / type db.PersonDB]]) http.HandlerFunc {\n\treturn func(w http.ResponseWriter, req *http.Request) {\n\t\tname, err := ioutil.ReadAll(req.Body)\n\t\tif err != nil {\n\t\t\tlog.Printf(\"error reading name: %v\", err)\n\t\t\tw.WriteHeader(http.StatusInternalServerError)\n\t\t\treturn\n\t\t}\n\n\t\tperson, err := people.[[GetPerson / type db.PersonDB]](name)\n\t\tif err != nil {\n\t\t\tif errors.Is(err, [[db / package db]].[[NotFound / var db.NotFound]]) {\n\t\t\t\t[[util / package util]].[[WriteStringAndCode / func util.WriteStringAndCode]](w, http.StatusNotFound, \"you don't exist\\n\")\n\t\t\t} else {\n\t\t\t\tlog.Printf(\"error getting person from database: %v\", err)\n\t\t\t\tw.WriteHeader(http.StatusInternalServerError)\n\t\t\t}\n\t\t\treturn\n\t\t}\n\n\t\tvar message string\n\n\t\t_, nowMonth, nowDay := time.Now().Date()\n\t\t_, birthdayMonth, birthdayDay := person.[[Birthday / type db.Person]].Date()\n\n\t\tif nowMonth == birthdayMonth \u0026\u0026 nowDay == birthdayDay {\n\t\t\tmessage = fmt.Sprintf(\"Happy birthday, %s! Today is a special day. Congrats on turning %d, and best wishes for the coming year!\\n\", person.[[Name / type db.Person]], person.[[Age / func db.Person:Age]]())\n\t\t} else {\n\t\t\tdaysUntilBirthday := (person.[[Birthday / type db.Person]].YearDay() - time.Now().YearDay()) % 365\n\t\t\tmessage = fmt.Sprintf(\"It's not your birthday yet, but only %d days to go!\\n\", daysUntilBirthday)\n\t\t}\n\n\t\t[[util / package util]].[[WriteStringAndCode / func util.WriteStringAndCode]](w, http.StatusOK, message)\n\t}\n}\n"
  },
  {
    "name": "main",
    "imports": "import (\n\t\"io\"\n\t\"log\"\n\t\"net/http\"\n\n\t[[\"github.com/bvisness/columns-concept/birthday\" / package birthday]]\n\t[[\"github.com/bvisness/columns-concept/db\" / package db]]\n\t[[\"github.com/bvisness/columns-concept/greet\" / package greet]]\n)\n",
    "notes": "Imagine if our programming environments weren't constrained to files.\n\nIn this concept, you can navigate the source code for this simple Go webserver not by browsing files, but by browsing \u003cstrong\u003ereferences\u003c/strong\u003e. When you follow a reference, the referenced item, and any relevant context, will appear on the right.\n\nYou may think this is what IDEs do already. But by forgetting about files, we can stop working with the program's representation on disk, and instead work with \u003cstrong\u003ethe program itself\u003c/strong\u003e.\n",
    "vars": null,
    "types": null,
    "funcs": [
      {
        "sort": 28,
        "name": "main",
        "receiverType": "",
        "text": "func main() {\n\tpeople := [[db / package db]].[[NewFileBackedPersonDB / func db.NewFileBackedPersonDB]](\"./people.json\")\n\n\thttp.HandleFunc(\"/greet\", [[greet / package greet]].[[GreetHandler / func greet.GreetHandler]](people))\n\thttp.HandleFunc(\"/birthday\", [[birthday / package birthday]].[[BirthdayHandler / func birthday.BirthdayHandler]](people))\n\n\tlog.Fatal(http.ListenAndServe(\":8080\", nil))\n}\n"
      }
    ],
    "text": "package main\n\nimport (\n\t\"io\"\n\t\"log\"\n\t\"net/http\"\n\n\t[[\"github.com/bvisness/columns-concept/birthday\" / package birthday]]\n\t[[\"github.com/bvisness/columns-concept/db\" / package db]]\n\t[[\"github.com/bvisness/columns-concept/greet\" / package greet]]\n)\n\n'''\nImagine if our programming environments weren't constrained to files.\n\nIn this concept, you can navigate the source code for this simple Go webserver not by browsing files, but by browsing \u003cstrong\u003ereferences\u003c/strong\u003e. When you follow a reference, the referenced item, and any relevant context, will appear on the right.\n\nYou may think this is what IDEs do already. But by forgetting about files, we can stop working with the program's representation on disk, and instead work with \u003cstrong\u003ethe program itself\u003c/strong\u003e.\n'''\n\nfunc main() {\n\tpeople := [[db / package db]].[[NewFileBackedPersonDB / func db.NewFileBackedPersonDB]](\"./people.json\")\n\n\thttp.HandleFunc(\"/greet\", [[greet / package greet]].[[GreetHandler / func greet.GreetHandler]](people))\n\thttp.HandleFunc(\"/birthday\", [[birthday / package birthday]].[[BirthdayHandler / func birthday.BirthdayHandler]](people))\n\n\tlog.Fatal(http.ListenAndServe(\":8080\", nil))\n}\n"
  }
];

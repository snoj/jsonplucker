# jsonplucker
Simply a wrapper for [lodash's at()](https://lodash.com/docs#at) function to make translating json files into easy digestable form for bash or whatever shell.

# Use
```
{
    "onething": 1,
    "anotherthing": {
        "anarray": [1,2,3,4]
        ,"you've": "got coming"
    }
}
```

Bash
```
user@localhost:~$ cat someJsonFile.json | jsonplucker onething anotherthing.1 "/you/"
onething 1
anotherthing.1 2
anotherthing.you've got coming
```

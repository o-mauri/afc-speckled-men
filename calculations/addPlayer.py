import json
def generateCode(name):
    parts = name.split(" ")
    code = parts[0][0] + parts[1][0] + parts[1][1]
    return code.upper()

print("Adding New Player!")
pname = input("Please enter the name of the new player: ")
code = generateCode(pname)

blankStats = {
      "name": pname,
      "statsC": {
        "matches": 0,
        "wins": 0,
        "goals": 0,
        "assists": 0,
        "winP": 0,
        "defensiveGP": 0,
        "defensiveGP_k": 0,
        "conceded": 0,
        "conceded_k": 0,
        "cleansheet": 0,
        "cleansheet_k": 0
      },
      "statsF": {
        "matches": 0,
        "wins": 0,
        "goals": 0,
        "assists": 0,
        "winP": 0,
        "defensiveGP": 0,
        "defensiveGP_k": 0,
        "conceded": 0,
        "conceded_k": 0,
        "cleansheet": 0,
        "cleansheet_k": 0
      }
    }

f = open("calculations/finalData.json" , "r")
rawData = json.load(f)
f.close()

squad = rawData["squad"]

squad[code] = blankStats

rawData["squad"] = squad

ff = open('calculations/finalData.json' , 'w')
json.dump(rawData, ff)

print(f"Finished Adding Player: {pname}")
print(f"Their player code is: {code}")
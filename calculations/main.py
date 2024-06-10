import json
from datetime import datetime

def sortStat(statList, rev = True):
    sor = sorted(statList, key=lambda x: x[1], reverse=rev)
    return sor

def addStat(playerCode, scorerList):
    added = False
    for item in scorerList:
        if item[0] == playerCode:
            item[1] += 1
            added = True
        
    if not added:
        scorerList.append([playerCode, 1])
    
    return scorerList

def addConceded(playerCode, oppscore, concededList):
    added = False
    for item in concededList:
        if item[0] == playerCode:
            item[2] += oppscore
            item[3] += 1
            
            item[1] = round(item[2]/item[3], 1)
            
            added = True
            
    if not added:
        concededList.append([playerCode, oppscore, oppscore, 1])
            
    return concededList


## SET FRIENDLY STATUS
nSeason = input("Has a new season started? (y/n): ")

if nSeason in ['Y', 'y']:
    nSeason = True
elif nSeason in ['N', 'n']:
    nSeason = False
else:
    raise ValueError('WRONG VALUE ENTERED')

## SET DATE
dateString = input("Enter Date of the Match (dd/mm/yy): ")

date = datetime.strptime(dateString, "%d/%m/%y")

## SET FRIENDLY STATUS
isFriendly = input("Was the match a friendly? (y/n): ")

if isFriendly in ['Y', 'y']:
    isFriendly = True
elif isFriendly in ['N', 'n']:
    isFriendly = False
else:
    raise ValueError('WRONG VALUE ENTERED')

## OPPONENT NAME

oppName = input("What was the opponent team name? : ")

## MATCH SCORE

print('Please enter the match score!')

sfScore = int(input("AFC Speckled Men: "))
oppScore = int(input(f"{oppName}: "))

print("Enter the AFC Speckled Men Match squad by player code! (RNG for Ringer) " )
squad = []
while True:
    p = input("Player Code (Enter if no more): ")
    if p == '':
        break
    squad.append(p)

print("Enter the code for the Speckled Men Goalkeeper")
keeper = input("Player Code: ")

print('Enter the player codes for the Speckled Men scorers: (RNG for Ringer) (OWN for Own Goal)')

scorers = []
for i in range(sfScore):
    g = input(f"Goal {i+1}: ")
    scorers.append(g)

print('Enter the player codes for the Speckled Men assisters: (RNG for Ringer) (OWN for Own Goal) press enter if no more assists')
assisters = []
for i in range(sfScore):
    g = input(f"Assist {i+1}: ")
    if g == '':
        break
    assisters.append(g)

f = open("calculations/finalData.json" , "r")

rawData = json.load(f)

f.close()

resObject = {
          "opp": oppName,
          "scr": sfScore,
          "oppScr": oppScore,
          "scorers": scorers
      }

if nSeason:
    rawData["seasonStats"] = [0, 0, 0, 0, 0, 0, 0]
    rawData["topScorers_s"] = []
    rawData["topAssist_s"] = []
    rawData["ringerGoalsS"] = 0
    rawData["ringerAstS"] = 0
    rawData["ownGoalS"] = 0                                                      
    rawData["cleansheet_s"] = []
    rawData["gapg_s"]
    rawData["results"] = [];
    rawData["cleansheet_k_s"] = []
    rawData["gapg_s"] = []
 

rawData["results"].append(resObject)

rawData['lastMatchData']['date'] = datetime.strftime(date, "%d/%m/%Y")
if isFriendly:
    rawData['lastMatchData']['type'] = "Friendly"
else:
    rawData['lastMatchData']['type'] = "League Match"
rawData['lastMatchData']['opponent'] = oppName
rawData['lastMatchData']['sfScore'] = sfScore
rawData['lastMatchData']['oppScore'] = oppScore
rawData['lastMatchData']['scorers'] = scorers
rawData['lastMatchData']['assisters'] = assisters

rawData["allTimeStatsF"][0] = rawData["allTimeStatsF"][0] + 1
if not isFriendly:
     rawData["allTimeStats"][0] = rawData["allTimeStats"][0] + 1
     rawData["seasonStats"][0] = rawData["seasonStats"][0] + 1

win = False
# SF WIN
if sfScore > oppScore:
    win = True
    rawData["allTimeStatsF"][1] = rawData["allTimeStatsF"][1] + 1
    if not isFriendly:
        rawData["allTimeStats"][1] = rawData["allTimeStats"][1] + 1
        rawData["seasonStats"][1] = rawData["seasonStats"][1] + 1
# DRAW

if sfScore == oppScore:
    rawData["allTimeStatsF"][2] = rawData["allTimeStatsF"][2] + 1
    if not isFriendly:
        rawData["allTimeStats"][2] = rawData["allTimeStats"][2] + 1
        rawData["seasonStats"][2] = rawData["seasonStats"][2] + 1
# SF LOSS

if sfScore < oppScore:
    rawData["allTimeStatsF"][3] = rawData["allTimeStatsF"][3] + 1
    if not isFriendly:
        rawData["allTimeStats"][3] = rawData["allTimeStats"][3] + 1
        rawData["seasonStats"][3] = rawData["seasonStats"][3] + 1

# GOALS F & AGAINST
rawData["allTimeStatsF"][4] = rawData["allTimeStatsF"][4] + sfScore
rawData["allTimeStatsF"][5] = rawData["allTimeStatsF"][5] + oppScore
if not isFriendly:
    rawData["allTimeStats"][4] = rawData["allTimeStats"][4] + sfScore
    rawData["allTimeStats"][5] = rawData["allTimeStats"][5] + oppScore
    rawData["seasonStats"][4] = rawData["seasonStats"][4] + sfScore
    rawData["seasonStats"][5] = rawData["seasonStats"][5] + oppScore

#WIN PERCENTAGE
if rawData['seasonStats'][0] != 0:
    rawData["seasonStats"][6] = int(round(100*rawData["seasonStats"][1]/rawData["seasonStats"][0],0))
if rawData['allTimeStats'][0] != 0:
    rawData["allTimeStats"][6] = int(round(100*rawData["allTimeStats"][1]/rawData["allTimeStats"][0],0))
if rawData['allTimeStatsF'][0] != 0:
    rawData["allTimeStatsF"][6] = int(round(100*rawData["allTimeStatsF"][1]/rawData["allTimeStatsF"][0],0))


# ADD MATCH TO EACH PLAYER
for player in squad:
    if player != 'RNG':
        rawData['squad'][player]["statsF"]["matches"] += 1
        rawData['squad'][player]["statsF"]["defensiveGP"] += 1
        rawData['squad'][player]["statsF"]["conceded"] += oppScore
        if oppScore == 0:
            rawData['squad'][player]["statsF"]["cleansheet"] += 1
            
            if player == keeper:
                rawData['squad'][player]["statsF"]["cleansheet_k"] += 1
        if player == keeper:
            rawData['squad'][player]["statsF"]["defensiveGP_k"] += 1
            rawData['squad'][player]["statsF"]["conceded_k"] += oppScore
        
        if not isFriendly:
            rawData['squad'][player]["statsC"]["matches"] += 1
            rawData['squad'][player]["statsC"]["defensiveGP"] += 1
            rawData['squad'][player]["statsC"]["conceded"] += oppScore
            rawData['gapg_s'] = addConceded(player, oppScore, rawData['gapg_s'])
            
            if oppScore == 0:
                rawData['squad'][player]["statsC"]["cleansheet"] += 1
                if player == keeper:
                    rawData['squad'][player]["statsC"]["cleansheet_k"] += 1
                    rawData["cleansheet_k_s"] = addStat(player, rawData["cleansheet_k_s"])
            if player == keeper:
                rawData['squad'][player]["statsC"]["defensiveGP_k"] += 1
                rawData['squad'][player]["statsC"]["conceded_k"] += oppScore
        
        if win:
            rawData['squad'][player]["statsF"]["wins"] += 1
            if not isFriendly:
                rawData['squad'][player]["statsC"]["wins"] += 1

        rawData['squad'][player]["statsF"]["winP"] = int(round(100*rawData['squad'][player]["statsF"]["wins"]/rawData['squad'][player]["statsF"]["matches"],0))
        if not isFriendly:
            rawData['squad'][player]["statsC"]["winP"] = int(round(100*rawData['squad'][player]["statsC"]["wins"]/rawData['squad'][player]["statsC"]["matches"],0))


#HANDLE SCORERS

for scr in scorers:
    if scr == "RNG":
        rawData["ringerGoalsF"] += 1
        if not isFriendly:
            rawData["ringerGoals"] += 1
            rawData["ringerGoalsS"] += 1

    elif scr == "OWN":
        rawData["ownGoalF"] += 1
        if not isFriendly:
            rawData["ownGoalS"] += 1
            rawData["ownGoal"] += 1

    else:
        rawData["squad"][scr]["statsF"]["goals"] += 1

        if not isFriendly:
           rawData["topScorers_s"] = addStat(scr, rawData["topScorers_s"])
           rawData["squad"][scr]["statsC"]["goals"] += 1 

#HANDLE ASSISTERS

for scr in assisters:
    if scr == "RNG":
        rawData["ringerAstF"] += 1
        if not isFriendly:
            rawData["ringerAst"] += 1
            rawData["ringerAstS"] += 1

    else:
        rawData["topAssist_atF"] = addStat(scr, rawData["topAssist_atF"])
        rawData["squad"][scr]["statsF"]["assists"] += 1

        if not isFriendly:
           rawData["squad"][scr]["statsC"]["assists"] += 1
           rawData["topAssist_s"] = addStat(scr, rawData["topAssist_s"])

glist = []
alist = []
gFlist = []
aFlist = []

cleansheetList = []
gaPGList = []
cleansheetListF = []
gaPGListF = []

for pl in rawData["squad"].keys():
    if pl not in ["RNG","OWN"]:
        g = [pl, rawData["squad"][pl]["statsC"]["goals"]]
        a = [pl, rawData["squad"][pl]["statsC"]["assists"]]
        gF = [pl, rawData["squad"][pl]["statsF"]["goals"]]
        aF = [pl, rawData["squad"][pl]["statsF"]["assists"]]
        
        
        if rawData["squad"][pl]["statsC"]["defensiveGP"] > 0:
            gaPG = [pl, round(rawData["squad"][pl]["statsC"]["conceded"]/rawData["squad"][pl]["statsC"]["defensiveGP"], 1)]
            gaPGList.append(gaPG)
        if rawData["squad"][pl]["statsF"]["defensiveGP"] > 0:
            gaPGF = [pl, round(rawData["squad"][pl]["statsF"]["conceded"]/rawData["squad"][pl]["statsF"]["defensiveGP"], 1)]
            gaPGListF.append(gaPGF)
        cs = [pl, rawData["squad"][pl]["statsC"]["cleansheet_k"]]
        csF = [pl, rawData["squad"][pl]["statsF"]["cleansheet_k"]]
        
        glist.append(g)
        alist.append(a)
        gFlist.append(gF)
        aFlist.append(aF)

        if cs[1] > 0:
            cleansheetList.append(cs)
        if cs[1] > 0:
            cleansheetListF.append(csF)

rawData['topScorers_s'] = sortStat(rawData['topScorers_s'])
rawData['topScorers_at'] = sortStat(glist)[:5]
rawData['topScorers_atF'] = sortStat(gFlist)[:5]
rawData['topAssist_s'] = sortStat(rawData['topAssist_s'])
rawData['topAssist_at'] = sortStat(alist)[:5]
rawData['topAssist_atF'] = sortStat(aFlist)[:5]

rawData['cleansheet_k_s'] = sortStat(rawData['cleansheet_k_s'])
rawData['cleansheet_k_at'] = sortStat(cleansheetList)[:5]
rawData['cleansheet_k_atF'] = sortStat(cleansheetListF)[:5]
rawData['gapg_s'] = sortStat(rawData['gapg_s'], rev=False)
rawData["gapg_at"] = sortStat(gaPGList, rev=False)[:5]
rawData["gapg_atF"] = sortStat(gaPGListF, rev=False)[:5]

ff = open('calculations/tmpData.json' , 'w')
json.dump(rawData, ff)


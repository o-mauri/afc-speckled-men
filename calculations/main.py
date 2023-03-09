import json
from datetime import datetime

def sortStat(statList):
    sor = sorted(statList, key=lambda x: x[1], reverse=True)
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

sfScore = int(input("Space Filled FC: "))
oppScore = int(input(f"{oppName}: "))

print("Enter the SpaceFilledFC Match squad by player code! (RNG for Ringer) " )
squad = []
while True:
    p = input("Player Code (Enter if no more): ")
    if p == '':
        break
    squad.append(p)


print('Enter the player codes for the SpaceFilled scorers: (RNG for Ringer) (OWN for Own Goal)')

scorers = []
for i in range(sfScore):
    g = input(f"Goal {i+1}: ")
    scorers.append(g)

print('Enter the player codes for the SpaceFilled assisters: (RNG for Ringer) (OWN for Own Goal) press enter if no more assists')
assisters = []
for i in range(sfScore):
    g = input(f"Assist {i+1}: ")
    if g == '':
        break
    assisters.append(g)

f = open("calculations/finalData.json" , "r")

rawData = json.load(f)

f.close()

if nSeason:
    rawData["seasonStats"] = [0, 0, 0, 0, 0, 0, 0]
    rawData["topScorers_s"] = []
    rawData["topAssist_s"] = []
    rawData["ringerGoalsS"] = 0
    rawData["ringerAstS"] = 0
    rawData["ownGoalS"] = 0
 

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
        if not isFriendly:
            rawData['squad'][player]["statsC"]["matches"] += 1
        
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
        rawData["topScorers_atF"] = addStat(scr, rawData["topScorers_atF"])
        rawData["squad"][scr]["statsF"]["goals"] += 1

        if not isFriendly:
           rawData["topScorers_s"] = addStat(scr, rawData["topScorers_s"])
           rawData["topScorers_at"] = addStat(scr, rawData["topScorers_at"])
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
           rawData["topAssist_s"] = addStat(scr, rawData["topAssist_s"])
           rawData["topAssist_at"] = addStat(scr, rawData["topAssist_at"])
           rawData["squad"][scr]["statsC"]["assists"] += 1 

        

rawData['topScorers_s'] = sortStat(rawData['topScorers_s'])
rawData['topScorers_at'] = sortStat(rawData['topScorers_at'])
rawData['topScorers_atF'] = sortStat(rawData['topScorers_atF'])
rawData['topAssist_s'] = sortStat(rawData['topAssist_s'])
rawData['topAssist_at'] = sortStat(rawData['topAssist_at'])
rawData['topAssist_atF'] = sortStat(rawData['topAssist_atF'])

ff = open('calculations/tmpData.json' , 'w')
json.dump(rawData, ff)


# Milou van Casteren
# Data processing
# convert KNMI text file to csv to json

import csv
import json
import pandas as pd

# read in csv file using pandas library
input = pd.read_csv('data.csv', usecols=[0,5,6])

location = input["LOCATION"]
time = input["TIME"]
value = input["Value"]

# select rows specific for the Netherlands
data = input.take(range(1026,1083))

# write as json file
with open ('data.json', 'w') as f:
    json = data.to_json(orient = "records")
    f.write(json)
    print(json)

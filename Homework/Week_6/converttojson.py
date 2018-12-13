# Milou van Casteren
# Data processing Week 6 & 7
# convert csv to json

import csv
import json
import pandas as pd


input = pd.read_csv('data.csv')

# write as json file
with open ('linked.json', 'w') as f:
    json = input.set_index('Country').to_json(orient='index')
    f.write(json)

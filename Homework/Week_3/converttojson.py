# Milou van Casteren
# Data processing
# convert KNMI text file to csv to json

import csv
import json
import pandas as pd

KNMI = 'min_temp_schiphol.txt'

# read in text file and remove spaces
with open(KNMI, 'r') as file:
    stripped = (line.strip() for line in file)
    lines = (line.split(",") for line in stripped if line if line[0].isdigit())

    # write as csv file
    with open('KNMI.csv', 'w') as out:
        writer = csv.writer(out)
        writer.writerow(('STN', 'YYYYMMDD', 'TN'))
        writer.writerows(lines)

input = pd.read_csv('KNMI.csv')

# write as json file
with open ('KNMI.json', 'w') as f:
    json = input.set_index('YYYYMMDD').to_json(orient='index')
    f.write(json)

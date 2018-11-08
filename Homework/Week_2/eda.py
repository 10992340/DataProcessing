# Milou van Casteren
# minor programmeren
# eda.py

import csv
import pandas

INPUT_CSV = "input.csv"

with open(INPUT_CSV, newline='') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        print(row)
        if not row:
             print("12")

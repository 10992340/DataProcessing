#!/usr/bin/env python
# Name: Milou van Casteren
# Student number: 10992340
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# extract year and rate from movies.csv
with open(INPUT_CSV, newline='') as csvfile:
    spamreader = csv.reader(csvfile)
    count = 0
    # add rating(value) for year(key) to dictionary
    for row in spamreader:
        if count > 1:
            listrows = row[1:3]
            data_dict[listrows[1]].append(listrows[0])
        count += 1
    meanrate = []
    for key in range(START_YEAR, END_YEAR):
        liststringrating = data_dict[str(key)]
        listintrating = []
        for elem in liststringrating:
            elem = float(elem)
            listintrating.append(elem)
        # calculate the meanrating per year
        meanrating = sum(listintrating) / len(listintrating)
        meanrate.append(meanrating)

if __name__ == "__main__":
    
    # visualizing data in plot
    plt.plot(range(START_YEAR, END_YEAR), meanrate, 'ro')
    plt.yticks([8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9])
    plt.xticks(range(START_YEAR, END_YEAR))
    plt.axis([START_YEAR, END_YEAR, 8, 9])
    plt.ylabel('Rating')
    plt.xlabel('Year')
    plt.grid()
    plt.show()

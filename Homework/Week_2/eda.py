# Milou van Casteren
# minor programmeren
# eda.py

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json

# read in data
INPUT_CSV = 'input.csv'
country = 'Country'
region = 'Region'
density = 'Pop. Density (per sq. mi.)'
mortality = 'Infant mortality (per 1000 births)'
GDP = 'GDP ($ per capita) dollars'

input = pd.read_csv(INPUT_CSV)

# Parsing and preprocessing the data
input = input.replace('unknown', np.nan)
input[country] = input[country].str.strip()
input[region] = input[region].str.strip()
input[GDP] = input[GDP].str.strip('dollars')
input[GDP] = input[GDP].astype(float)
input[mortality] = input[mortality].str.replace(',', '.')
input[mortality] = input[mortality].astype(float)
input[density] = input[density].str.replace(',', '.')
input[density] = input[density].astype(float)
print(input.head(5))
input.to_csv('out.csv')

# Calculate mean, median and mode for GDP
mean = round(input[GDP].mean(), 1)
median = input[GDP].median()
mode = input[GDP].mode()
print(f'For the GDP ($ per capita) dollars, the mean is {mean}, the median is {median} and the mode is {mode}')

# Produce a histogram of the GDP data
list_GDP = []
list_GDP = input[GDP].tolist()
# remove nan values
cleanlist_GDP = [x for x in list_GDP if str(x) != 'nan']
# remove outlier
cleanlist_GDP.remove(max(cleanlist_GDP))
plt.hist(cleanlist_GDP,50)
plt.xlabel('GDP ($ per capita) dollars')
plt.ylabel('Amount of countries')
plt.show()

# Compute the Five Number Summary of the Infant Mortality data
print(input[mortality].describe()[['min', '25%', '50%', '75%', 'max']])

# Produce a box plot of the Infant Mortality data
input[mortality].plot.box()
plt.show()

# Write a .json file in the correct format
input = input[[country,region,density,mortality,GDP]]
json = input.set_index(country).to_json(orient='index')
print(json)
with open ('input.json', 'w') as f:
    f.write(json)

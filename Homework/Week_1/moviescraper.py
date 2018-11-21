#!/usr/bin/env python
# Name: Milou van Casteren
# Student number: 10992340
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # extracting title, rating, year, actors and runtime from IMDB page and placing in movies list
    movies = []
    for link in dom.find_all('div', {"class":"lister-item-content"}):
        dictmovies = {}
        # title
        title = link.h3.a.string
        dictmovies['Title'] = title

        # rating
        rating = link.find('div', {"class":"inline-block ratings-imdb-rating"})
        rating = rating.strong.text
        dictmovies['Rating'] = rating

        # year
        years = link.find('span', {"class":"lister-item-year text-muted unbold"}).string
        year = ""
        for char in years:
            if char.isdigit():
                year += char
        dictmovies['Year'] = year

        # actors
        actors = link.find_all('p', {"class":""})[1]
        actors = actors.find_all('a')
        stringactors = ""
        for item in actors:
            linkss = item.get('href')
            if 'ref_=adv_li_st' in linkss:
                stringactors += item.string
                stringactors += ", "
        dictmovies['Actors'] = stringactors[:-2]

        # runtime
        runtime = link.find('span', {"class":"runtime"}).string
        runtime = runtime[:-4]
        dictmovies['Runtime'] = runtime

        movies.append(dictmovies)

    # return the list of movies with corresponding information
    return movies

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['sep=,'])
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    for elem in movies:
        writer.writerow([elem['Title'], elem['Rating'], elem['Year'], elem['Actors'], elem['Runtime']])
    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE MOVIES TO DISK


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)

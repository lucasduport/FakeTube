# CSC 317 Course Project

## Purpose

The purpose of this repository is to store all the code for your web application. This also includes the history of all commits made and who made them. Only code submitted on the master branch will be graded.

Please follow the instructions below and fill in the information requested when prompted.

## Student Information

|               | Information   |
|:-------------:|:-------------:|
| Student Name  | Lucas Duport  |
| Student ID    | 923108235     |
| Student Email | lduport@sfsu.edu|

# Extra-credits
## Tags
Tags are handled in the database. When a user creates a post, they can add tags to it.
The tags are stored in a row of posts table. 
When a user sees a tag on a post, they can click on it and it will take them to a search page related to this tag.

## Private posts
Private posts are handled in the database. When a user creates a post, they can choose to make it public or not.
If a post is not public, it won't be displayed on the home page neither with the search function.
The post will still be available with a direct link (like a private youtube video).

Through the profile page, a user can see all their posts, public and private. 
A user can change the privacy of a post by clicking on the icon next to the post title.

# Build/Run Instructions

## Build Instructions
1. Make a clean install of all node packages `npm ci`
2. Build the database `npm run builddb`
3. Start the server `npm start`

## Run Instructions
1. Open a browser and navigate to `localhost:3000`

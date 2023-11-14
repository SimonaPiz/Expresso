# <img src="https://github.com/SimonaPiz/Expresso/blob/main/favicon.png" width="20px" alt="Expresso icon" title="Expresso icon"/> Expresso

> Build a full back-end CRUD API for Expresso, a local café.

<img src="https://github.com/SimonaPiz/Expresso/blob/main/PreviewExpresso.png" width="600px" alt="preview" title="preview"/>

## Table of Contents
* [Project Overview](#project-overview)
* [Implementation Details](#implementation-details)
* [Testing](#testing)
* [Screenshots](#screenshots)
* [Technologies Used](#technologies-used)
* [Setup](#setup)
* [Acknowledgements](#acknowledgements)
* [Author](#author)

## Project Overview

In this capstone project, I build all of the routing and database logic for an internal tool for a coffee shop called Expresso.

The Expresso internal tool should allow users to:
- Create, view, update, and delete menus
- Create, view, update, and delete menu items
- Create, view, update, and delete employees
- Create, view, update, and delete employee's timesheets

You can view all of this functionality in action in the video below: [▶](https://s3.amazonaws.com/codecademy-content/programs/build-apis/solution-videos/Expresso480.mov)

## Implementation Details

To complete this project, I needed to create the database tables and API routes specified below.

- [x]  Setup
  - Setup Project
  - Setup Server. Create and export the Express app
  - Create and export API Router for `/api`

  ✔ [#2 issue](https://github.com/SimonaPiz/Expresso/issues/2)


- [x]  Create Database Tables

  ✔ [#3 issue](https://github.com/SimonaPiz/Expresso/issues/3)


  - **Employee**
    - id - Integer, primary key, required
    - name - Text, required
    - position - Text, required
    - wage - Integer, required
    - is_current_employee - Integer, defaults to `1`

  - **Timesheet**
    - id - Integer, primary key, required
    - hours - Integer, required
    - rate - Integer, required
    - date - Integer, required
    - employee_id - Integer, foreign key, required

  - **Menu**
    - id - Integer, primary key, required
    - title - Text, required

  - **MenuItem**
    - id - Integer, primary key, required
    - name - Text, required
    - description - Text, optional
    - inventory - Integer, required
    - price - Integer, required
    - menu_id - Integer, foreign key, required

- [x]  Create Route Paths

  ✔ [#4 issue](https://github.com/SimonaPiz/Expresso/issues/4)

  **/api/employees**
    - GET
    - POST

  **/api/employees/:employeeId**
    - GET
    - PUT
    - DELETE

  **/api/employees/:employeeId/timesheets**
    - GET
    - POST

  **/api/employees/:employeeId/timesheets/:timesheetId**
    - PUT
    - DELETE

  **/api/menus**
    - GET
    - POST

  **/api/menus/:menuId**
    - GET
    - PUT
    - DELETE

  **/api/menus/:menuId/menu-items**
    - GET
    - POST

  **/api/menus/:menuId/menu-items/:menuItemId**
    - PUT
    - DELETE


## Testing

A testing suite has been provided. 

  ✔ All Test Passed

  ![Test Results](https://user-images.githubusercontent.com/91121660/282711903-fc748408-0470-493e-a819-45340af0783b.png)

## Screenshots

<img src="https://github.com/SimonaPiz/Expresso/assets/91121660/7b601c3f-72cc-4f83-8b21-1b53885d7819" width="600px" alt="dinner preview" title="dinner preview"/>

<img src="https://github.com/SimonaPiz/Expresso/assets/91121660/17bce7d6-082b-4be8-93d2-d6dc927f54e7" width="600px" alt="employee preview" title="employee preview"/>


## Setup
In the root directory of the project run
```
$ npm  install
```
To view a local version of the site, open **index.html** in the browser.

## Technologies Used
  - React 15
  - react-router-dom 4
  - mocha 10
  - chai 4
  - express 4
  - sqlite3 5
  - body-parser 1
  - cors 2
  - errorhandler 1

## Acknowledgements

This project comes from the [Codecademy's Create a Back-End with JavaScript](https://www.codecademy.com/learn/paths/create-a-back-end-app-with-javascript) course.

## Author

- [Simona Pizio](https://github.com/SimonaPiz)

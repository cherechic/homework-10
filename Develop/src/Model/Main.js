const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const util = require("util");

const Engineer = require("./Engineer");
const Intern = require("./intern");
const Manager = require("./Manager");

const writeFileAsync = util.promisify(fs.writeFile);

class Main {
  constructor() {
    this._teamArray = [];
  }

  async _easy() {
    let teamHTMLString = "";
    for (const teamMember of this._teamArray) {
      teamHTMLString += teamMember.easy();
    }
    const result = Main._templateStart + teamHTMLString + Main._templateEnd;
    await writeFileAsync(
      path.resolve(__dirname, "..", "dist", "easy.html"),
      result
    );
  }

  async run() {
    const { teamSize } = await inquirer.prompt([
      {
        type: "input",
        name: "teamSize",
        messaage: "How large is your team?",
        defult: 2
      }
    ]);
    for (let i = 0; i < teamSize; i++) {
      console.log("==============================");
      const response = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          messaage: "Please input your name"
        },
        {
          type: "input",
          name: "email",
          messaage: "Please input your email"
        },
        {
          type: "list",
          name: "role",
          messaage: "Please input your role",
          choices: [Main._ENGINEER, Main._INTERN, Main._MANAGER]
        },
        {
          type: "input",
          name: "github",
          messaage: "Please input your github",
          when: ({ role }) => role === Main._ENGINEER
        },
        {
          type: "input",
          name: "school",
          messaage: "Please input your school",
          when: ({ role }) => role === Main._INTERN
        },
        {
          type: "input",
          name: "roomNumber",
          messaage: "Please input your room number",
          when: ({ role }) => role === Main._MANAGER
        }
      ]);
      const { name, email, role, github, school, roomNumber } = response;
      if (role === Main._ENGINEER) {
        this._teamArray.push(new Engineer(name, email, github));
      }
      if (role === Main._INTERN) {
        this._teamArray.push(new Intern(name, email, school));
      }
      if (role === Main._MANAGER) {
        this._teamArray.push(new Manager(name, email, roomNumber));
      }
    }
    await this._easy();
  }
}

Main._ENGINEER = "engineer";
Main._INTERN = "intern";
Main._MANAGER = "manager";

Main._templateStart = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
      crossorigin="anonymous"
    />
    <style>
      .page-header {
        background: lightblue;
        padding: 30px;
        font-size: xx-large;
        text-align: center;
        font-weight: bold;
      }
      .team-roster-container {
        display: flex;
        padding: 50px;
      }
      .card:not(:last-child) {
        margin-right: 20px;
      }
    </style>
    <title>Team Roster</title>
  </head>
  <body>
    <div class="page-header">My Team</div>

    <div class="team-roster-container">
    `;
Main._templateEnd = `
    </div>

    <script
      src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
      integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
      integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
      integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
      crossorigin="anonymous"
    ></script>
  </body>
</html>

`;

module.exports = Main;

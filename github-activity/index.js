const axios = require("axios");
const chalk = require("chalk");

// GitHub username to fetch activity for
const username = process.argv[2]; // e.g., node index.js octocat

if (!username) {
    console.log(chalk.red("Please provide a GitHub username."));
    process.exit(1);
}

const GITHUB_API = `https://api.github.com/users/${username}/events/public`;

async function fetchActivity() {
    try {
        const { data } = await axios.get(GITHUB_API, {
            headers: { "User-Agent": "github-activity-script" }
        });

        console.log(chalk.blue.bold(`\nRecent activity for @${username}\n`));

        if (data.length === 0) {
            console.log(chalk.yellow("No recent public activity found."));
            return;
        }

        data.slice(0, 10).forEach(event => {
            let eventType = chalk.green(event.type);
            let repo = chalk.cyan(event.repo.name);
            let time = chalk.gray(new Date(event.created_at).toLocaleString());

            console.log(`${eventType} → ${repo} (${time})`);
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(chalk.red("User not found."));
        } else {
            console.log(chalk.red("Error fetching activity:"), error.message);
        }
    }
}

fetchActivity();

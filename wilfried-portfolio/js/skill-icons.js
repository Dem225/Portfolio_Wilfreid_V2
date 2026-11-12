const SKILL_ICONS = {
    python: {
        name: "Python",
        color: "#3776AB",
        url: "https://cdn.simpleicons.org/python"
    },
    django: {
        name: "Django",
        color: "#092E20",
        url: "https://cdn.simpleicons.org/django"
    },
    fastapi: {
        name: "FastAPI",
        color: "#009688",
        url: "https://cdn.simpleicons.org/fastapi"
    },
    javascript: {
        name: "JavaScript",
        color: "#F7DF1E",
        url: "https://cdn.simpleicons.org/javascript"
    },
    typescript: {
        name: "TypeScript",
        color: "#3178C6",
        url: "https://cdn.simpleicons.org/typescript"
    },
    html5: {
        name: "HTML5",
        color: "#E34F26",
        url: "https://cdn.simpleicons.org/html5"
    },
    url: "https://cdn.simpleicons.org/css3/1572B6",
    php: {
        name: "PHP",
        color: "#777BB4",
        url: "https://cdn.simpleicons.org/php"
    },
    flask: {
        name: "Flask",
        color: "#000000",
        url: "https://cdn.simpleicons.org/flask"
    },
    nodejs: {
        name: "Node.js",
        color: "#5FA04E",
        url: "https://cdn.simpleicons.org/nodedotjs"
    },
    postgresql: {
        name: "PostgreSQL",
        color: "#4169E1",
        url: "https://cdn.simpleicons.org/postgresql"
    },
    mysql: {
        name: "MySQL",
        color: "#4479A1",
        url: "https://cdn.simpleicons.org/mysql"
    },
    sqlite: {
        name: "SQLite",
        color: "#003B57",
        url: "https://cdn.simpleicons.org/sqlite"
    },
    mongodb: {
        name: "MongoDB",
        color: "#47A248",
        url: "https://cdn.simpleicons.org/mongodb"
    },
    redis: {
        name: "Redis",
        color: "#FF4438",
        url: "https://cdn.simpleicons.org/redis"
    },
    docker: {
        name: "Docker",
        color: "#2496ED",
        url: "https://cdn.simpleicons.org/docker"
    },
    git: {
        name: "Git",
        color: "#F05032",
        url: "https://cdn.simpleicons.org/git"
    },
    github: {
        name: "GitHub",
        color: "#181717",
        url: "https://cdn.simpleicons.org/github"
    },
    linux: {
        name: "Linux",
        color: "#FCC624",
        url: "https://cdn.simpleicons.org/linux"
    },
    postman: {
        name: "Postman",
        color: "#FF6C37",
        url: "https://cdn.simpleicons.org/postman"
    },
    openai: {
        name: "OpenAI",
        color: "#412991",
        url: "https://cdn.simpleicons.org/openai"
    },
    tensorflow: {
        name: "TensorFlow",
        color: "#FF6F00",
        url: "https://cdn.simpleicons.org/tensorflow"
    },
    pytorch: {
        name: "PyTorch",
        color: "#EE4C2C",
        url: "https://cdn.simpleicons.org/pytorch"
    }
};

const GENERAL_SKILL_ICONS = {
    code: "code",
    server: "dns",
    database: "database",
    shield: "security",
    cloud: "cloud"
};

function getSkillIcon(icon) {
    const key = String(icon || "").toLowerCase();

    if (SKILL_ICONS[key]) {
        const item = SKILL_ICONS[key];

        return `
            <img
                src="${item.url}"
                alt="${item.name}"
                title="${item.name}"
                class="skill-logo"
                loading="lazy"
            >
        `;
    }

    const materialIcon = GENERAL_SKILL_ICONS[key] || "terminal";

    return `
        <span class="material-symbols-outlined">
            ${materialIcon}
        </span>
    `;
}
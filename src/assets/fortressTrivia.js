export const FortressTrivia = [
    {
        question: "What is the Tower of London's official name?",
        correct: "Her Majesty's Royal Palace and Fortress of the Tower of London",
        incorrect: ["Her Majesty's Armory at the Tower of London", "The Royal Fortress of the Tower of London", "Her Majesty's Royal Palace at the Tower of London"]
    },
    {
        question: "What are the small, glassless windows (generally used for archers) called?",
        correct: "An embrasure",
        incorrect: ["A loophole", "A shot-trap", "A redent"]
    },
    {
        question: "Who ordered the construction of the Crac des Chevaliers in Syria",
        correct: "Saint John of Jerusalem",
        incorrect: ["King Richard", "Al-Malik al-Zahir Rukn al-Din Baybars al-Bunduqdari", "Abu Kamil Nasr ibn Salih ibn Mirdas"]
    },
    {
        question: "In which of these decades was the term 'fortress' used most?",
        correct: "The 1820s",
        incorrect: ["The 1940s", "The 2010s", "The 1890s"]
    },
    {
        question: "Which of these is the largest fortress in the world?",
        correct: "Malbork Castle Zamek",
        incorrect: ["Edinburgh Castle", "Citadel of Aleppo", "Hohensalzburg Castle"]
    },
    {
        question: "Which of these is not a fortress?",
        correct: "Panagia Paraportiani",
        incorrect: ["The Tower of London", "Malbork Castle Zamek", "Crac des Chevaliers"]
    },
    {
        question: "Which fort was the starting place of the French-Indian war?",
        correct: "Fort LeBouef",
        incorrect: ["Fort de France", "Fort de la Mare", "Fort de la Côte"]
    },
    {
        question: "The type of fort called a Bastion fort generally looks like a...",
        correct: "Star",
        incorrect: ["Square", "Triangle", "Circle"]
    }
]

export const getTriviaQuestion = () => {
    const randomIndex = Math.floor(Math.random() * FortressTrivia.length)
    return FortressTrivia[randomIndex]
}
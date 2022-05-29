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
    }
]

export const getTriviaQuestion = () => {
    const randomIndex = Math.floor(Math.random() * FortressTrivia.length)
    return FortressTrivia[randomIndex]
}
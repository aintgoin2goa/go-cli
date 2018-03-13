const checkIfVariableIsUndefined = (
    variable,
    message
) => {
    if (variable === undefined) {
        throw new Error(message);
    }
};

const variableChecker = ({ checkIfVariableIsUndefined }) => (
    obj,
    variableNames
) => {
    variableNames.forEach(
        nameOfVariable => checkIfVariableIsUndefined(
            obj[nameOfVariable],
            `The required variable \`${nameOfVariable}\` is undefined.`
        )
    );

    return true;
};

const checkVariables = variableChecker({ checkIfVariableIsUndefined });

module.exports = {
    checkVariables,
    variableChecker,
};

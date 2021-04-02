export const average = (data: number[]) => {
    const sum = data.reduce((sum, value) => {
        return sum + value;
    });
    return sum / data.length;
}
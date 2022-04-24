const formatDateProperties = (dateProperty: number) => {
    return dateProperty.toString().length === 1 ? `0${dateProperty}` : dateProperty;
};

// has to be format: YYYY-MM-DDThh:mm
const getDateAndTime = () => {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = formatDateProperties(dateObj.getMonth() + 1);
    const date = formatDateProperties(dateObj.getDate());
    const hours = formatDateProperties(dateObj.getHours());
    const minutes = formatDateProperties(dateObj.getMinutes());

    return `${year}-${month}-${date}T${hours}:${minutes}`;
};

export default getDateAndTime;

const readableDateTime = (date: string) => date.replaceAll('-', '/').split('T').join(' at ');

export default readableDateTime;

export function checkBirthday(birthday: string | undefined) {
  if (!birthday) return false;

  const today = new Date();

  return (
    today.getDate() === new Date(birthday).getDate() &&
    today.getMonth() === new Date(birthday).getMonth()
  );
}

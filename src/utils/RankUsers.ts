type UserEntry = {
  username: string;
  weektotal: number;
  date: string; // ISO string
};

type RankedUser = {
  position: number;
  username: string;
  weektotal: number;
};

function rankUsers(users: UserEntry[]): RankedUser[] {
  const shuffled = users
    .map(user => ({ ...user, rand: Math.random() }))
    .sort((a, b) => a.rand - b.rand);

  const sorted = shuffled.sort((a, b) => {
    if (b.weektotal !== a.weektotal) {
      return b.weektotal - a.weektotal;
    }

    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    return aDate - bDate;
  });

  return sorted.map((user, index) => ({
    position: index + 1,
    username: user.username,
    weektotal: user.weektotal,
  }));
}

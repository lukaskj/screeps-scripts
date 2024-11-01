const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

class Utils {
  static allRooms() {
    return Object.values(Game.rooms);
  }

  static formatDate(date) {
    return dateFormatter.format(date);
  }
}

module.exports = Utils;

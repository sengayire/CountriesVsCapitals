/* eslint-disable require-jsdoc */
import { geographyQuizGenerator } from '../helpers/game';
import { compareUser } from '../helpers';

export default class GamingRoomController {
  constructor() {
    const { country, capital, question } = geographyQuizGenerator();
    this.rooms = [
      {
        name: 'public',
        owner: {},
        members: [],
        question,
        capital,
        country
      }
    ];
  }

  createRoom(owner, name) {
    let isRoom = false;
    let newRoom = {};
    const { country, capital, question } = geographyQuizGenerator();
    if (owner && name) {
      newRoom = {
        name,
        owner,
        country,
        capital,
        question,
        members: [
          {
            ...owner,
            attempts: {
              geography: [],
              computing: []
            }
          }
        ]
      };
      this.rooms.forEach((room) => {
        if (room.name === name) {
          isRoom = true;
        }
      });
      this.rooms = isRoom ? this.rooms : [...this.rooms, newRoom];
    }

    return { isRoom, newRoom };
  }

  joinRoom(member, roomName) {
    let isMember = false;
    let hasJoined = false;
    const findRoom = this.rooms.filter(room => room.name === (roomName || 'public'))[0];
    if (findRoom) {
      this.rooms.forEach((room, index) => {
        if (room.name === findRoom.name) {
          this.rooms[index].members.forEach((value) => {
            if (compareUser(value, member)) {
              isMember = true;
            }
          });

          if (!isMember) {
            findRoom.members = [
              ...findRoom.members,
              {
                ...member,
                attempts: {
                  geography: [],
                  computing: []
                }
              }
            ];
            this.rooms[index].members = findRoom.members;
            hasJoined = true;
          }
        }
      });
    }

    return {
      hasJoined,
      room: findRoom || {}
    };
  }

  getRoom(roomName) {
    return this.rooms.filter(room => room.name === (roomName || 'public'))[0];
  }

  getRoomMembers(roomName) {
    const findRoom = this.rooms.filter(room => room.name === (roomName || 'public'))[0];

    if (findRoom) {
      return findRoom.members;
    }

    return [];
  }

  getAllRooms() {
    return this.rooms;
  }

  leaveRoom(member, roomName) {
    const findRoom = this.rooms.filter(room => room.name === (roomName || 'public'))[0];
    if (findRoom) {
      this.rooms.forEach((room, index) => {
        if (room.name === findRoom.name) {
          findRoom.members = this.rooms[index].members.filter((value) => {
            if (!compareUser(value, member)) {
              return value;
            }
            return false;
          });

          this.rooms[index].members = compareUser(findRoom.owner, member) ? [] : findRoom.members;
        }
      });
    }

    return findRoom || {};
  }

  changeQuestion(roomName) {
    const { country, capital, question } = geographyQuizGenerator();
    let findRoom = this.rooms.filter(room => room.name === (roomName || 'public'))[0];
    if (findRoom) {
      this.rooms.forEach((room, index) => {
        if (room.name === findRoom.name) {
          findRoom = {
            ...findRoom,
            question,
            country,
            capital
          };
          this.rooms[index] = findRoom;
        }
      });
    }

    return findRoom || {};
  }

  answerQuestion(point, member, roomName) {
    const findRoom = this.rooms.filter(room => room.name === (roomName || 'public'))[0];
    if (findRoom) {
      this.rooms.forEach((room, index) => {
        if (room.name === findRoom.name) {
          findRoom.members.forEach((value, pos) => {
            if (compareUser(value, member)) {
              findRoom.members[pos].attempts.geography = [
                ...findRoom.members[pos].attempts.geography,
                point
              ];
            }
          });

          this.rooms[index].members = findRoom.members;
        }
      });
    }

    return findRoom || {};
  }

  replayGame(member, roomName) {
    const findRoom = this.rooms.filter(room => room.name === (roomName || 'public'))[0];
    if (findRoom) {
      this.rooms.forEach((room, index) => {
        if (room.name === findRoom.name && compareUser(room.owner, member)) {
          findRoom.members = this.rooms[index].members.map(value => ({
            ...value,
            attempts: {
              geography: [],
              computing: []
            }
          }));

          this.rooms[index].members = findRoom.members;
        }
      });
    }

    return findRoom || {};
  }
}

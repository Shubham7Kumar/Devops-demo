import {jest} from '@jest/globals'

const getUser = jest.fn();

test("mock function should return controlled data", () => {
  getUser.mockReturnValue({
    name: "Mock User",
  });

  const user = getUser();

  expect(user.name).toBe("Mock User");
  expect(getUser).toHaveBeenCalled();
  expect(getUser).toHaveBeenCalledTimes(1);
});

test("mock function can simulate a failure", async () => {
  const getData = jest.fn();

  getData.mockRejectedValue(new Error("Redis unavailable"));

  await expect(getData()).rejects.toThrow("Redis unavailable");

  expect(getData).toHaveBeenCalledTimes(1);
});
// const database = {

//   getUser: () => {
//     return {
//       name: "Real User",
//     };
//   },
// };



// test("mock example", () => {
//   const originalGetUser = database.getUser;

//   database.getUser = () => {
//     return {
//       name: "Mock User",
//     };
//   };

//   const user = database.getUser();

//   expect(user.name).toBe("Mock User");

//   database.getUser = originalGetUser;
// });
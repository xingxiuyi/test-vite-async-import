export const asyncFunc = async () => {
  const sf = (await import("./simpleFunc")).simpleFunc;
  return sf();
};

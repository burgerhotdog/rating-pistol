export default async (promise) => {
  try {
    return await promise;
  } catch (err) {
    console.error("Firebase error:", err);
    return null;
  }
};

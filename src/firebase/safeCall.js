export default async function safeCall(promise) {
  try {
    return await promise;
  } catch (err) {
    console.error("Firebase error:", err);
    return null;
  }
};

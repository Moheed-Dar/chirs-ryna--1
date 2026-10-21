import mongoose from 'mongoose';

/**
 * Ye function kisi bhi Model (Lead, Contact) ko Read mark karega.
 * @param {Model} Model - Mongoose Model (jaise Lead ya Contact)
 * @param {string} id - Document ki ID
 * @returns {Object} - Updated document ya error
 */
export const markAsRead = async (Model, id) => {
  // 1. ID Validate karo
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }

  // 2. Database mein dhundo aur isRead = true kar do
  const updatedDoc = await Model.findByIdAndUpdate(
    id,
    { isRead: true },
    { new : true, runValidators: true } // new : true se updated doc return hoga
  );

  // 3. Agar document nahi mili
  if (!updatedDoc) {
    throw new Error("Document not found");
  }

  return updatedDoc;
};
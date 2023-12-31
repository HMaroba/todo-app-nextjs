import IBook from "@/interfaces/book";
import mongoose, { Schema, model, models } from "mongoose";

const BookingSchema = new Schema({
  customerId: {
    type: String,
    ref: "User",
    required: [true, "Customer id is required"],
  },
  pickupDate: {
    type: Date,
    required: [true, "Pick up date is required"],
  },
  pickupTime: {
    type: String,
    required: [true, "Pick up time is required"],
  },
  deliveryDate: {
    type: Date,
    required: [true, "Delivery date is required"],
  },
  deliveryTime: {
    type: String,
    required: [true, "Delivery time is required"],
  },
  laundryType: {
    type: String,
    required: [true, "Laundry type is required"],
  },
  LaundryContainer: {
    type: String,
    required: [true, "Laundry container is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  bookingStatus: {
    type: String,
  },
  laundryStatus: {
    type: String,
  },

  fullName: {
    type: String,
    required: [true, "Full name is required"],
    minLength: [4, "Full name should be atleast 4 characters long"],
    maxLength: [30, "Full name should be less than 30 characters"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    validate: {
      validator: function (value: string) {
        return /^\d{8}$/.test(value);
      },
      message: "Invalid phone number, it should be 8 numeric characters",
    },
  },
});

// const Book = models.Book || model("Use6Bookings", BookingSchema);
// const Book =
//   mongoose.models.BookingsList ||
//   mongoose.model<IBook>("CustomerBookingsList", BookingSchema);
  const Book = models.bookings || model("bookings", BookingSchema)

export default Book;

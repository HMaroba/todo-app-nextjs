export default interface IBook {
    customerId : string | null,
    pickupDate : Date,
    pickupTime : string,
    fullName : string,
    deliveryDate : Date,
    deliveryTime : string,
    location : string,
    laundryType : string,
    LaundryContainer : string,
    quantity : Number,
    phoneNumber : string,
    laundryStatus : string,
    bookingStatus : string,
}
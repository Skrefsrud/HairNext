function updateBookingType(newBookingType: BookingType | BookingType[]) {
  setBookingData((prevBookingData) => ({
    ...prevBookingData, // Keep everything in bookingData
    bookingDetails: {
      ...prevBookingData.bookingDetails, // Keep everything in bookingDetails
      bookingType: newBookingType, // Update only bookingType
    },
  }));
}

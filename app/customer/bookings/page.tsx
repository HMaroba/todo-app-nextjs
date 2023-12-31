"use client";
import IBOOK from "@/app/models/book.type";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { uploadError } from "@/app/Validators/FormValidator";

export default function BookingList() {
  const userId = localStorage.getItem("userId");
  console.log(userId);
  const [booking, setBooking] = useState<IBOOK[]>([]);
  const [selectedItem, setSelectedItem] = useState<IBOOK | null>(null);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IBOOK>();

  useEffect(() => {
    async function fetchBooking() {
      await axios
        .get("/api/v1/book")
        .then((response) => {
          // console.log(response.data.bookings);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    async function fetchUserBookings() {
      try {
        const response = await axios.get("/api/v1/book/users/" + userId);
        const userBookings = response.data.userBookings;
        // console.log(response.data.userBookings);
        // console.log("User Bookings:", userBookings);
        setBooking(response.data.userBookings);
        // Handle the user bookings data here
      } catch (error) {
        console.error("Error fetching user bookings:", error);
        // Handle the error
      }
    }
    fetchUserBookings();

    fetchBooking();
  }, [userId]);

  const handleUpdate = (itemId: string) => {
    router.push(`/customer/updatebooking/${itemId}`);
  };

  const handleDelete = async (bookingId: string) => {
    try {
      await axios
        .delete(`/api/v1/book/${bookingId}`)
        .then((response) => {
          console.log(response.data.message);

          // Update the state with the updated data
          // setBooking((prevBooking) =>
          //   prevBooking.map((item) =>
          //     item._id === bookingId ? response.data.updatedBooking : item
          //   )
          // );

          // Close the modal
          onClose();

          toast({
            title: "Booking Deleted Sucessfully",
            description: response.data.message,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Booking Deleted failed",
            description: error.response.data.message,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete2 = async (itemId: string) => {
    try {
      console.log(itemId);
      const response = await axios.delete(`api/v1/book/${itemId}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (item: IBOOK) => {
    setSelectedItem(item);
    onOpen();
  };

  const onSubmit = async (data: IBOOK) => {
    try {
      const updateData = {
        newName: data.fullName,
        newPhone: data.phoneNumber,
        newLocation: data.location,
      };
      console.log(updateData);
      const response = await axios.put(
        `/api/v1/book/${selectedItem?._id}`,
        updateData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      // Update the state with the updated data
      // setBooking((prevBooking) =>
      //   prevBooking.map((item) =>
      //     item._id === selectedItem?._id ? response.data.updatedBooking : item
      //   )
      // );
      setBooking((prevBookings) =>
        prevBookings.map((item) =>
          item._id === selectedItem?._id ? { ...item, ...updateData } : item
        )
      );

      // Close the modal
      onClose();

      console.log(response.data);
      toast({
        title: "Booking updated Sucessfully",
        description: response.data.message,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error: any) {
      console.log(error.response.data.message);
      toast({
        title: "Booking Failed",
        description: error.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Text fontSize={"3xl"} color={"gray.600"} p={9}>
        Booking List
      </Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Full Names</Th>
              <Th>Pickup time</Th>
              <Th>Delivery time</Th>
              <Th>Phone Number</Th>
              <Th>Booking Status</Th>
              <Th>Update</Th>
            </Tr>
          </Thead>

          {booking.map((item: IBOOK, index) => (
            <Tbody key={index}>
              <Td>{item?.fullName}</Td>
              <Td>{item?.pickupTime}</Td>
              <Td>{item?.deliveryTime}</Td>
              <Td>{item?.phoneNumber}</Td>
              <Td>{item?.bookingStatus}</Td>
              <Td>
                <Button
                  colorScheme="teal"
                  onClick={() => handleUpdate(item._id)}
                  size="sm"
                >
                  Update
                </Button>
              </Td>
              <Td>
                <Button
                  colorScheme="red"
                  onClick={() => handleDelete(item._id)}
                  size="sm"
                >
                  Delete
                </Button>
              </Td>

              <Td>
                <Button
                  colorScheme="red"
                  onClick={() => handleEdit(item)}
                  size="sm"
                >
                  Edit
                </Button>
              </Td>
            </Tbody>
          ))}
        </Table>
      </TableContainer>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <ModalContent>
            <ModalHeader>Update my Booking</ModalHeader>
            <ModalCloseButton />

            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>First name {selectedItem?._id}</FormLabel>
                <Input
                  placeholder="First name"
                  focusBorderColor="pink"
                  defaultValue={selectedItem?.fullName || ""}
                  {...register("fullName", uploadError.fullName)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Contact NO.</FormLabel>
                <Input
                  placeholder="Last name"
                  focusBorderColor="pink"
                  defaultValue={selectedItem?.phoneNumber || ""}
                  {...register("phoneNumber", uploadError.phoneNumber)}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Address.</FormLabel>
                <Input
                  placeholder="Last name"
                  focusBorderColor="pink"
                  defaultValue={selectedItem?.location || ""}
                  {...register("location", uploadError.location)}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Pick up Time</FormLabel>
                <Input
                  placeholder="Last name"
                  focusBorderColor="pink"
                  defaultValue={selectedItem?.pickupTime || ""}
                  {...register("pickupTime", uploadError.pickupTime)}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="pink" mr={3} type="submit">
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}

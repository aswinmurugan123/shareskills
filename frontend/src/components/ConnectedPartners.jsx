import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import useShowToast from "../hooks/useShowToast";

const ConnectedPartners = () => {
  const [partners, setPartners] = useState([]);
  const showToast = useShowToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("/api/users/partners"); // API call
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPartners(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    fetchPartners();
  }, [showToast]);

  return (
    <Box mt={8}>
      <Text mb={4} fontSize="lg" fontWeight="bold">
        Connected People
      </Text>
      {partners.length === 0 ? (
        <Text color="gray.500">You have no connected partners yet.</Text>
      ) : (
        partners.map((partner) => (
          <Flex
            key={partner._id}
            align="center"
            mb={4}
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
            p={2}
            borderRadius="md"
            onClick={() => navigate(`/profile/${partner.username}`)}
          >
            <Avatar src={partner.profilePic} name={partner.username} size="sm" mr={3} />
            <Text fontWeight="medium">{partner.username}</Text>
          </Flex>
        ))
      )}
    </Box>
  );
};

export default ConnectedPartners;

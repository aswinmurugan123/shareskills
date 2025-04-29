import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiNotebook } from "react-icons/gi"; // 🎯 Changed Icon for "study" vibe
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
	const [searchingUser, setSearchingUser] = useState(false);
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [searchText, setSearchText] = useState("");
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	const currentUser = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const { socket, onlineUsers } = useSocket();

	useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("/api/messages/conversations");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setConversations(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingConversations(false);
			}
		};

		getConversations();
	}, [showToast, setConversations]);

	const handleConversationSearch = async (e) => {
		e.preventDefault();
		setSearchingUser(true);
		try {
			const res = await fetch(`/api/users/profile/${searchText}`);
			const searchedUser = await res.json();
			if (searchedUser.error) {
				showToast("Error", searchedUser.error, "error");
				return;
			}

			const messagingYourself = searchedUser._id === currentUser._id;
			if (messagingYourself) {
				showToast("Error", "You cannot message yourself", "error");
				return;
			}

			const conversationAlreadyExists = conversations.find(
				(conversation) => conversation.participants[0]._id === searchedUser._id
			);

			if (conversationAlreadyExists) {
				setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					userProfilePic: searchedUser.profilePic,
				});
				return;
			}

			const mockConversation = {
				mock: true,
				lastMessage: {
					text: "",
					sender: "",
				},
				_id: Date.now(),
				participants: [
					{
						_id: searchedUser._id,
						username: searchedUser.username,
						profilePic: searchedUser.profilePic,
					},
				],
			};
			setConversations((prevConvs) => [...prevConvs, mockConversation]);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setSearchingUser(false);
		}
	};

	return (
		<Box
			position={"absolute"}
			left={"50%"}
			w={{ base: "100%", md: "80%", lg: "750px" }}
			p={4}
			transform={"translateX(-50%)"}
		>
			<Flex
				gap={4}
				flexDirection={{ base: "column", md: "row" }}
				maxW={{
					sm: "400px",
					md: "full",
				}}
				mx={"auto"}
			>
				{/* Left Side */}
				<Flex
  flex={30}
  gap={4}
  flexDirection="column"
  maxW={{ sm: "250px", md: "full" }}
  mx="auto"
  bg={useColorModeValue("gray.50", "gray.800")}
  p={4}
  borderRadius="md"
  boxShadow="md"
>
  {/* Title */}
  <Text
    fontWeight={700}
    fontSize="lg"
    color={useColorModeValue("gray.700", "gray.200")}
    mb={2}
    textAlign="center"
  >
    Your Study Connections
  </Text>

  {/* Search Form */}
  <form onSubmit={handleConversationSearch}>
    <Flex alignItems="center" gap={2}>
      <Input
        id="searchUserInput"
        placeholder="Search a study buddy"
        onChange={(e) => setSearchText(e.target.value)}
        bg={useColorModeValue("white", "gray.700")}
        _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
      />
      <Button size="sm" type="submit" isLoading={searchingUser} colorScheme="blue">
        <SearchIcon />
      </Button>
    </Flex>
  </form>

  {/* Loading Skeletons */}
  {loadingConversations &&
    [0, 1, 2, 3, 4].map((_, i) => (
      <Flex
        key={i}
        gap={4}
        alignItems="center"
        p={2}
        borderRadius="md"
        bg={useColorModeValue("gray.100", "gray.700")}
      >
        <SkeletonCircle size="10" />
        <Flex w="full" flexDirection="column" gap={2}>
          <Skeleton h="10px" w="70%" />
          <Skeleton h="8px" w="60%" />
        </Flex>
      </Flex>
    ))}

  {/* Conversations */}
  {!loadingConversations &&
    conversations.map((conversation) => (
      <Conversation
        key={conversation._id}
        isOnline={onlineUsers.includes(conversation.participants[0]._id)}
        conversation={conversation}
      />
    ))}
</Flex>


				{/* Right Side */}
				{!selectedConversation._id && (
					<Flex
						flex={70}
						borderRadius={"md"}
						p={4}
						flexDir={"column"}
						alignItems={"center"}
						justifyContent={"center"}
						height={"400px"}
						textAlign={"center"}
						bg={useColorModeValue("gray.50", "gray.700")}
						boxShadow="md"
					>
						<GiNotebook size={100} color="#4299E1" /> {/* Changed Icon */}
						<Text fontSize="2xl" mt={4} fontWeight="bold">
							Connect with a Study Partner! 📖
						</Text>
						<Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")} mt={2} px={4}>
							Team up, learn faster, and ace your goals together! <br />
							Search for a study buddy today 🚀
						</Text>
						<Button 
							mt={6} 
							colorScheme="blue" 
							size="sm" 
							onClick={() => document.getElementById('searchUserInput')?.focus()}
						>
							Find a Study Buddy
						</Button>
					</Flex>
				)}

				{/* If selected conversation */}
				{selectedConversation._id && <MessageContainer />}
			</Flex>
		</Box>
	);
};

export default ChatPage;

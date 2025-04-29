import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";

const Message = ({ ownMessage, message }) => {
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const user = useRecoilValue(userAtom);
	const [imgLoaded, setImgLoaded] = useState(false);

	return (
		<>
			{ownMessage ? (
				<Flex gap={2} alignSelf={"flex-end"} alignItems="flex-end">
					{/* Text Message */}
					{message.text && (
						<Flex
							bgGradient="linear(to-l, green.400, green.600)"
							color="white"
							maxW="300px"
							p={3}
							borderRadius="20px 20px 0px 20px"
							position="relative"
							boxShadow="md"
						>
							<Text fontSize="sm">{message.text}</Text>
							<Box
								position="absolute"
								bottom="2px"
								right="8px"
								color={message.seen ? "blue.300" : "whiteAlpha.700"}
							>
								<BsCheck2All size={14} />
							</Box>
						</Flex>
					)}

					{/* Image Message */}
					{message.img && (
						<Flex direction="column" alignItems="flex-end">
							{!imgLoaded && (
								<Skeleton w="200px" h="200px" borderRadius="12px" />
							)}
							<Image
								src={message.img}
								display={imgLoaded ? "block" : "none"}
								onLoad={() => setImgLoaded(true)}
								alt="Message image"
								borderRadius="12px"
								boxShadow="md"
								maxW="200px"
								objectFit="cover"
							/>
							{imgLoaded && (
								<Box
									mt={1}
									color={message.seen ? "blue.300" : "gray.400"}
								>
									<BsCheck2All size={16} />
								</Box>
							)}
						</Flex>
					)}

					<Avatar src={user.profilePic} size="sm" />
				</Flex>
			) : (
				<Flex gap={2} alignItems="flex-end">
					<Avatar src={selectedConversation.userProfilePic} size="sm" />

					{/* Text Message */}
					{message.text && (
						<Flex
							bg="gray.100"
							color="black"
							maxW="300px"
							p={3}
							borderRadius="20px 20px 20px 0px"
							position="relative"
							boxShadow="sm"
						>
							<Text fontSize="sm">{message.text}</Text>
						</Flex>
					)}

					{/* Image Message */}
					{message.img && (
						<Flex direction="column" alignItems="flex-start">
							{!imgLoaded && (
								<Skeleton w="200px" h="200px" borderRadius="12px" />
							)}
							<Image
								src={message.img}
								display={imgLoaded ? "block" : "none"}
								onLoad={() => setImgLoaded(true)}
								alt="Message image"
								borderRadius="12px"
								boxShadow="md"
								maxW="200px"
								objectFit="cover"
							/>
						</Flex>
					)}
				</Flex>
			)}
		</>
	);
};

export default Message;

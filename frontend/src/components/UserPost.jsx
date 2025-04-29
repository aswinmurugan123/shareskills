import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useState } from "react";

const UserPost = ({ postImg, postTitle, likes, replies }) => {
	const [liked, setLiked] = useState(false);

	return (
		<Link to={"/markzuckerberg/post/1"}>
			<Box 
				bg="rgba(255, 255, 255, 0.05)"
				backdropFilter="blur(8px)"
				border="1px solid"
				borderColor="gray.700"
				borderRadius="2xl"
				p={5}
				_hover={{ transform: "scale(1.01)", shadow: "xl" }}
				transition="all 0.3s"
				mb={6}
			>
				<Flex gap={4}>
					<Avatar size="lg" name="Mark Zuckerberg" src="/zuck-avatar.png" />
					<Flex flex={1} direction="column" gap={3}>
						<Flex justifyContent="space-between" alignItems="center">
							<Flex alignItems="center" gap={2}>
								<Text fontWeight="bold" fontSize="md">
									markzuckerberg
								</Text>
								<Image src="/verified.png" w={4} h={4} />
							</Flex>
							<BsThreeDots size={20} color="gray" />
						</Flex>

						<Text fontSize="sm" color="gray.300">
							{postTitle}
						</Text>

						{postImg && (
							<Box
								borderRadius="lg"
								overflow="hidden"
								border="1px solid"
								borderColor="gray.600"
								mt={2}
							>
								<Image src={postImg} w="full" objectFit="cover" />
							</Box>
						)}

						<Flex mt={2} alignItems="center">
							<Actions liked={liked} setLiked={setLiked} />
						</Flex>

						<Flex alignItems="center" gap={2} mt={2}>
							<Text fontSize="xs" bgGradient="linear(to-r, teal.300, blue.300)" bgClip="text">
								{replies} replies
							</Text>
							<Box w="1" h="1" borderRadius="full" bg="gray.400" />
							<Text fontSize="xs" bgGradient="linear(to-r, pink.300, purple.300)" bgClip="text">
								{likes} likes
							</Text>
						</Flex>
					</Flex>

					{/* Mini avatars */}
					<Flex direction="column" justifyContent="center" gap={1}>
						<Avatar
							size="xs"
							name="Dan Abramov"
							src="https://bit.ly/dan-abramov"
							border="2px solid white"
						/>
						<Avatar
							size="xs"
							name="Sage Adebayo"
							src="https://bit.ly/sage-adebayo"
							border="2px solid white"
						/>
						<Avatar
							size="xs"
							name="Prosper Baba"
							src="https://bit.ly/prosper-baba"
							border="2px solid white"
						/>
					</Flex>
				</Flex>
			</Box>
		</Link>
	);
};

export default UserPost;

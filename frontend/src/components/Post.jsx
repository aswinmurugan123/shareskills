import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { IconButton, useColorModeValue } from "@chakra-ui/react";

const Post = ({ post, postedBy }) => {
	const [user, setUser] = useState(null);
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const navigate = useNavigate();

	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.700", "gray.300");

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch("/api/users/profile/" + postedBy);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};
		getUser();
	}, [postedBy, showToast]);

	const handleDeletePost = async (e) => {
		e.preventDefault();
		if (!window.confirm("Are you sure you want to delete this post?")) return;

		try {
			const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			setPosts(posts.filter((p) => p._id !== post._id));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	if (!user) return null;

	return (
		<Link to={`/${user.username}/post/${post._id}`}>
			<Box 
				bg={cardBg} 
				borderRadius="md" 
				p={5} 
				mb={6} 
				shadow="sm" 
				border="1px solid" 
				borderColor={borderColor}
				transition="all 0.3s"
				_hover={{ shadow: "md" }}
			>
				<Flex gap={4}>
					<Avatar 
						size="md" 
						name={user.name} 
						src={user?.profilePic}
						cursor="pointer"
						onClick={(e) => {
							e.preventDefault();
							navigate(`/${user.username}`);
						}}
					/>
					<Flex flexDirection="column" flex={1}>
						<Flex justifyContent="space-between" alignItems="center">
							<Flex alignItems="center" gap={2}>
								<Text
									fontWeight="bold"
									fontSize="md"
									color={textColor}
									cursor="pointer"
									onClick={(e) => {
										e.preventDefault();
										navigate(`/${user.username}`);
									}}
								>
									{user?.username}
								</Text>
								{user.isVerified && <Image src="/verified.png" w={4} h={4} />}
							</Flex>

							<Flex alignItems="center" gap={2}>
								<Text fontSize="xs" color="gray.500">
									{formatDistanceToNow(new Date(post.createdAt))} ago
								</Text>
								{currentUser?._id === user._id && (
									<IconButton
										size="sm"
										icon={<DeleteIcon />}
										variant="ghost"
										colorScheme="red"
										onClick={handleDeletePost}
										aria-label="Delete post"
									/>
								)}
							</Flex>
						</Flex>

						<Text mt={2} fontSize="sm" color={textColor}>
							{post.text}
						</Text>

						{post.img && (
							<Box 
								mt={4} 
								borderRadius="md" 
								overflow="hidden"
								border="1px solid"
								borderColor={borderColor}
							>
								<Image src={post.img} w="full" objectFit="cover" />
							</Box>
						)}

						{/* Actions like Like, Comment */}
						<Flex mt={4}>
							<Actions post={post} />
						</Flex>
					</Flex>
				</Flex>
			</Box>
		</Link>
	);
};

export default Post;

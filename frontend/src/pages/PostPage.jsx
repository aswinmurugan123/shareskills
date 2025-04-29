import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Image,
	Input,
	Spinner,
	Text,
	IconButton,
	Tooltip,
	useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import { motion } from "framer-motion";

import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";

const MotionBox = motion(Box);

const PostPage = () => {
	const { user, loading } = useGetUserProfile();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const showToast = useShowToast();
	const { pid } = useParams();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();

	const [newReply, setNewReply] = useState("");
	const [postingReply, setPostingReply] = useState(false);
	const [showAllReplies, setShowAllReplies] = useState(false);

	const currentPost = posts[0];

	const cardBg = useColorModeValue("white", "gray.900");
	const borderColor = useColorModeValue("gray.300", "gray.700");
	const textColor = useColorModeValue("gray.800", "gray.200");
	const subtleTextColor = useColorModeValue("gray.500", "gray.400");

	useEffect(() => {
		const getPost = async () => {
			setPosts([]);
			try {
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, pid, setPosts]);

	const handleDeletePost = async () => {
		try {
			if (!window.confirm("Are you sure you want to delete this post?")) return;
			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			navigate(`/${user.username}`);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const handlePostReply = async () => {
		if (newReply.trim() === "") {
			showToast("Error", "Reply cannot be empty", "error");
			return;
		}

		setPostingReply(true);
		try {
			const res = await fetch(`/api/posts/reply/${currentPost._id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: newReply }),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			setPosts(prevPosts => {
				const updatedPost = { ...prevPosts[0], replies: [...prevPosts[0].replies, data] };
				return [updatedPost];
			});
			setNewReply("");
			showToast("Success", "Reply posted!", "success");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setPostingReply(false);
		}
	};

	if (!user && loading) {
		return (
			<Flex justify="center" align="center" minH="60vh">
				<Spinner size="xl" color="blue.500" />
			</Flex>
		);
	}

	if (!currentPost) return null;

	return (
		<MotionBox
			bg={cardBg}
			p={8}
			rounded="2xl"
			shadow="xl"
			border="1px solid"
			borderColor={borderColor}
			mt={6}
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* User Header */}
			<Flex justify="space-between" align="center" mb={6}>
				<Flex align="center" gap={4}>
					<Avatar src={user.profilePic} size="md" name={user.username} />
					<Box>
						<Flex align="center" gap={2}>
							<Text fontWeight="bold" fontSize="lg" color={textColor}>
								{user.username}
							</Text>
							{user.isVerified && <Image src="/verified.png" w={5} h={5} />}
						</Flex>
						<Text fontSize="xs" color={subtleTextColor}>
							{formatDistanceToNow(new Date(currentPost.createdAt))} ago
						</Text>
					</Box>
				</Flex>
				{currentUser?._id === user._id && (
					<Tooltip label="Delete Post" hasArrow>
						<IconButton
							size="sm"
							icon={<DeleteIcon />}
							variant="ghost"
							colorScheme="red"
							onClick={handleDeletePost}
							aria-label="Delete post"
						/>
					</Tooltip>
				)}
			</Flex>

			{/* Post Text */}
			<Text fontSize="lg" mb={6} color={textColor} noOfLines={[4, 6]}>
				{currentPost.text}
			</Text>

			{/* Post Image */}
			{currentPost.img && (
				<Box
					rounded="lg"
					overflow="hidden"
					border="1px solid"
					borderColor={borderColor}
					mb={6}
				>
					<Image src={currentPost.img} w="full" objectFit="cover" transition="0.3s ease" _hover={{ transform: "scale(1.02)" }} />
				</Box>
			)}

			{/* Actions */}
			<Actions post={currentPost} />

			<Divider my={6} />

			{/* Motivational Section */}
			<Box
				bgGradient="linear(to-r, teal.400, blue.500)"
				p={4}
				rounded="md"
				textAlign="center"
				color="white"
				fontWeight="bold"
				mb={8}
			>
				<Text fontSize="lg">🚀 Keep posting, keep growing. Your voice matters. ✨</Text>
			</Box>

			{/* Reply Input */}
			<Flex align="center" gap={3} mb={8}>
				<Avatar src={currentUser?.profilePic} size="sm" />
				<Input
					placeholder="Write your amazing reply here..."
					value={newReply}
					onChange={(e) => setNewReply(e.target.value)}
					variant="filled"
					bg={useColorModeValue("gray.100", "gray.700")}
					_hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
					focusBorderColor="blue.400"
					color={textColor}
				/>
				<Button
					bgGradient="linear(to-r, blue.400, purple.500)"
					color="white"
					_hover={{ bgGradient: "linear(to-r, blue.500, purple.600)" }}
					onClick={handlePostReply}
					isLoading={postingReply}
				>
					Reply
				</Button>
			</Flex>

			{/* Replies */}
			<Box>
				{currentPost.replies.length === 0 && (
					<Text color={subtleTextColor} fontSize="sm" textAlign="center" mt={4}>
						No replies yet. Start the conversation! 💬
					</Text>
				)}
				{currentPost.replies
					.slice(0, showAllReplies ? currentPost.replies.length : 3)
					.map((reply) => (
						<Comment key={reply._id} reply={reply} />
					))}

				{currentPost.replies.length > 3 && (
					<Button
						variant="ghost"
						colorScheme="blue"
						size="sm"
						mt={4}
						onClick={() => setShowAllReplies(!showAllReplies)}
						_hover={{ textDecoration: "underline" }}
					>
						{showAllReplies ? "Show Less Replies" : `View ${currentPost.replies.length - 3} More Replies`}
					</Button>
				)}
			</Box>
		</MotionBox>
	);
};

export default PostPage;

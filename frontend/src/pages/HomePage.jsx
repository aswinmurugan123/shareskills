import { Box, Button, Flex, Input, Spinner, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import userAtom from "../atoms/userAtom";

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const [quotes, setQuotes] = useState([
		"Stay positive. Work hard. Make it happen.",
		"Your only limit is your mind.",
		"Small progress is still progress.",
		"Believe you can and you're halfway there.",
		"Success doesn't come from what you do occasionally, it comes from what you do consistently."
	]);
	const [newQuote, setNewQuote] = useState("");

	const showToast = useShowToast();
	const user = useRecoilValue(userAtom);

	// Theme based values
	const pageBg = useColorModeValue("#f3f2ef", "gray.900");
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.700", "gray.300");
	const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
	const highlightColor = useColorModeValue("blue.500", "blue.300");

	const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch("/api/posts/feed");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);

	const handleAddQuote = () => {
		if (newQuote.trim().length === 0) {
			showToast("Error", "Quote cannot be empty", "error");
			return;
		}
		setQuotes(prev => [...prev, newQuote.trim()]);
		showToast("Success", "Quote added!", "success");
		setNewQuote("");
	};

	return (
		<Flex justify="center" gap={8} pt={8} px={4} bg={pageBg} minH="100vh">
			{/* Feed Section */}
			<Box flex={65} maxW="600px" w="full">

				{/* Welcome Banner */}
				<Box 
					bg={cardBg}
					border="1px solid"
					borderColor={borderColor}
					borderRadius="md"
					p={6}
					mb={6}
					textAlign="center"
					boxShadow="md"
					transition="all 0.3s"
					_hover={{ boxShadow: "lg" }}
				>
					<Text fontSize="2xl" fontWeight="bold" color={highlightColor}>
						Welcome back, {user?.username || "Learner"}! 👋
					</Text>
					<Text mt={2} fontSize="md" color={secondaryTextColor}>
						{randomQuote}
					</Text>
				</Box>

				{/* Add Quote Section */}
				<Box
					bg={cardBg}
					p={5}
					mb={6}
					borderRadius="md"
					boxShadow="base"
					border="1px solid"
					borderColor={borderColor}
				>
					<Text mb={4} fontSize="lg" fontWeight="semibold" color={textColor}>
						Add your own motivational quote ✍️
					</Text>
					<Flex gap={2}>
						<Input
							placeholder="Enter your quote..."
							value={newQuote}
							onChange={(e) => setNewQuote(e.target.value)}
							color={textColor}
							_focus={{ borderColor: highlightColor }}
						/>
						<Button colorScheme="blue" onClick={handleAddQuote}>
							Add
						</Button>
					</Flex>
				</Box>

				{/* Posts Area */}
				{loading ? (
					<Flex justify="center" align="center" h="60vh">
						<Spinner size="xl" color={highlightColor} thickness="4px" speed="0.8s" />
					</Flex>
				) : posts.length === 0 ? (
					<Flex
						justify="center"
						align="center"
						flexDir="column"
						mt={20}
						p={8}
						borderRadius="md"
						bg={cardBg}
						boxShadow="base"
						border="1px solid"
						borderColor={borderColor}
					>
						<Text fontSize="2xl" fontWeight="semibold" color={textColor} mb={2}>
							No study posts yet 📚
						</Text>
						<Text fontSize="md" color={secondaryTextColor}>
							Share your first thought today!
						</Text>
					</Flex>
				) : (
					<VStack spacing={6} align="stretch">
						{posts.map((post) => (
							<Box
								key={post._id}
								bg={cardBg}
								border="1px solid"
								borderColor={borderColor}
								borderRadius="md"
								p={5}
								w="full"
								boxShadow="base"
								transition="all 0.3s"
								_hover={{ boxShadow: "md", transform: "scale(1.01)" }}
							>
								<Post post={post} postedBy={post.postedBy} />
							</Box>
						))}
					</VStack>
				)}
			</Box>

			{/* Suggested Users Sidebar */}
			<Box
				flex={35}
				maxW="300px"
				position="sticky"
				top="100px"
				display={{ base: "none", md: "block" }}
			>
				<Box
					bg={cardBg}
					p={5}
					borderRadius="md"
					boxShadow="base"
					border="1px solid"
					borderColor={borderColor}
				>
					<Text mb={4} fontSize="lg" fontWeight="bold" color={textColor}>
						Suggested Connections
					</Text>
					<SuggestedUsers />
				</Box>
			</Box>
		</Flex>
	);
};

export default HomePage;

import { 
	Box, Button, Flex, IconButton, Image, Link, Text, Tooltip, useColorMode 
  } from "@chakra-ui/react";
  import { useRecoilValue, useSetRecoilState } from "recoil";
  import { Link as RouterLink, useLocation } from "react-router-dom";
  import { AiFillHome } from "react-icons/ai";
  import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
  import { BsFillChatQuoteFill } from "react-icons/bs";
  import { MdOutlineSettings } from "react-icons/md";
  import { RxAvatar } from "react-icons/rx";
  import userAtom from "../atoms/userAtom";
  import authScreenAtom from "../atoms/authAtom";
  import useLogout from "../hooks/useLogout";
  import { useEffect, useState } from "react";
  
  // Timer component
  const SessionTimer = () => {
	const [seconds, setSeconds] = useState(0);
  
	useEffect(() => {
	  const timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
	  return () => clearInterval(timer);
	}, []);
  
	const formatTime = (totalSeconds) => {
	  const mins = Math.floor(totalSeconds / 60);
	  const secs = totalSeconds % 60;
	  return `${mins}m ${secs}s`;
	};
  
	return (
	  <Text fontSize="xs" color="gray.500">
		Active: {formatTime(seconds)}
	  </Text>
	);
  };
  
  const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const location = useLocation();
	const currentPath = location.pathname;
  
	const [postsCount, setPostsCount] = useState(0);
  
	useEffect(() => {
	  const fetchUserPosts = async () => {
		if (!user) return;
		try {
		  const res = await fetch(`/api/posts/user/${user.username}`);
		  const data = await res.json();
		  if (Array.isArray(data)) {
			setPostsCount(data.length);
		  }
		} catch (error) {
		  console.error(error);
		}
	  };
	  fetchUserPosts();
	}, [user]);
  
	const level = Math.floor(postsCount / 10) + 1;
  
	return (
	  <Flex 
		as="nav" 
		align="center" 
		justify="space-between" 
		px={{ base: 4, md: 8 }} 
		py={3} 
		bg={colorMode === "light" ? "white" : "gray.900"} 
		boxShadow="sm"
		position="sticky"
		top="0"
		zIndex="1000"
	  >
		{/* Logo Section */}
		<Flex align="center" gap={3}>
		  <RouterLink to="/">
			<Flex align="center" gap={2}>
			  <Image src="/logo28.jpg" alt="Logo" boxSize="40px" rounded="full" />
			  <Text fontSize="2xl" fontWeight="bold" color="blue.500">
				ShareSkills
			  </Text>
			</Flex>
		  </RouterLink>
		</Flex>
  
		{/* Navigation Icons */}
		{user && (
		  <Flex align="center" gap={{ base: 3, md: 5 }}>
			{currentPath !== "/" && (
			  <Tooltip label="Home" hasArrow>
				<Link as={RouterLink} to="/">
				  <IconButton 
					icon={<AiFillHome />} 
					variant="ghost" 
					aria-label="Home" 
					fontSize="24px"
				  />
				</Link>
			  </Tooltip>
			)}
			{currentPath !== `/${user.username}` && (
			  <Tooltip label="Profile" hasArrow>
				<Link as={RouterLink} to={`/${user.username}`}>
				  <IconButton 
					icon={<RxAvatar />} 
					variant="ghost" 
					aria-label="Profile" 
					fontSize="24px"
				  />
				</Link>
			  </Tooltip>
			)}
			{currentPath !== "/chat" && (
			  <Tooltip label="Messages" hasArrow>
				<Link as={RouterLink} to="/chat">
				  <IconButton 
					icon={<BsFillChatQuoteFill />} 
					variant="ghost" 
					aria-label="Messages" 
					fontSize="22px"
				  />
				</Link>
			  </Tooltip>
			)}
			{currentPath !== "/settings" && (
			  <Tooltip label="Settings" hasArrow>
				<Link as={RouterLink} to="/settings">
				  <IconButton 
					icon={<MdOutlineSettings />} 
					variant="ghost" 
					aria-label="Settings" 
					fontSize="22px"
				  />
				</Link>
			  </Tooltip>
			)}
		  </Flex>
		)}
  
		{/* Right Section */}
		<Flex align="center" gap={4}>
		  {/* Dark mode toggle */}
		  <IconButton 
			icon={colorMode === "light" ? <FiMoon /> : <FiSun />} 
			onClick={toggleColorMode}
			variant="ghost"
			aria-label="Toggle Color Mode"
			fontSize="22px"
		  />
  
		  {/* Session Timer and Logout */}
		  {user && (
			<Flex direction="column" align="flex-end" fontSize="xs" color="gray.500">
			  <SessionTimer />
			  <Text>Level {level}</Text>
			  <Button 
				size="xs" 
				leftIcon={<FiLogOut />} 
				colorScheme="red" 
				variant="ghost"
				onClick={logout}
				mt={1}
			  >
				Logout
			  </Button>
			</Flex>
		  )}
  
		  {/* Auth Buttons if not logged in */}
		  {!user && (
			<Flex gap={2}>
			  <Button 
				size="sm" 
				colorScheme="blue" 
				variant="outline" 
				as={RouterLink} 
				to="/auth" 
				onClick={() => setAuthScreen("login")}
			  >
				Login
			  </Button>
			  <Button 
				size="sm" 
				colorScheme="green" 
				as={RouterLink} 
				to="/auth" 
				onClick={() => setAuthScreen("signup")}
			  >
				Sign Up
			  </Button>
			</Flex>
		  )}
		</Flex>
	  </Flex>
	);
  };
  
  export default Header;
  
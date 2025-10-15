import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Fade,
  Slide,
  Collapse,
  CardActionArea,
  Stack,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Snackbar,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  Folder as FolderIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Image as ImageIcon,
  VideoFile as VideoFileIcon,
  AudioFile as AudioFileIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Description as DescriptionIcon,
  TableChart as TableChartIcon,
  Slideshow as SlideshowIcon,
  TextSnippet as TextSnippetIcon,
  Upload as UploadIcon,
  CreateNewFolder as CreateNewFolderIcon,
  CloudDone as CloudDoneIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import driveService from '../../services/driveService.js';

const GoogleDrive = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [renameDialog, setRenameDialog] = useState({ open: false, fileId: '', currentName: '' });
  const [newFileName, setNewFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentFolder, setCurrentFolder] = useState('root');
  const [folderPath, setFolderPath] = useState([{ id: 'root', name: 'My Drive' }]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    checkSignInStatus();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [files, searchQuery]);

  const filterFiles = () => {
    let filtered = [...files];

    if (searchQuery) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.mimeType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFiles(filtered);
  };

  const checkSignInStatus = async () => {
    try {
      const signedIn = await driveService.isSignedIn();
      setIsSignedIn(signedIn);
      
      if (signedIn) {
        await loadFiles();
      }
    } catch (error) {
      console.error('Error checking sign-in status:', error);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await driveService.signIn();
      
      if (result.success) {
        setIsSignedIn(true);
        setUserProfile({
          name: result.user.getName(),
          email: result.user.getEmail(),
          imageUrl: result.user.getImageUrl()
        });
        await loadFiles();
      } else {
        setError(result.error || 'Failed to sign in');
      }
    } catch (error) {
      setError('An error occurred during sign in');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    
    try {
      const result = await driveService.signOut();
      
      if (result.success) {
        setIsSignedIn(false);
        setUserProfile(null);
        setFiles([]);
        setError('');
      } else {
        setError(result.error || 'Failed to sign out');
      }
    } catch (error) {
      setError('An error occurred during sign out');
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFiles = async (folderId = 'root') => {
    setRefreshing(true);
    setError('');
    
    try {
      const query = folderId === 'root' ? '' : `'${folderId}' in parents`;
      const result = await driveService.getFiles(10, query);
      
      if (result.success) {
        setFiles(result.files);
        setCurrentFolder(folderId);
      } else {
        setError(result.error || 'Failed to load files');
      }
    } catch (error) {
      setError('An error occurred while loading files');
      console.error('Load files error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFileClick = (file) => {
    if (file.mimeType.includes('folder')) {
      // Navigate into folder
      setFolderPath(prev => [...prev, { id: file.id, name: file.name }]);
      loadFiles(file.id);
    } else {
      // Open file in new tab
      window.open(file.webViewLink, '_blank');
    }
  };

  const handleFolderBack = () => {
    if (folderPath.length > 1) {
      const newPath = folderPath.slice(0, -1);
      const parentFolder = newPath[newPath.length - 1];
      setFolderPath(newPath);
      loadFiles(parentFolder.id);
    }
  };

  const handleContextMenu = (event, file) => {
    event.preventDefault();
    setSelectedFile(file);
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setSelectedFile(null);
  };

  const handleDownload = async (file) => {
    try {
      const result = await driveService.downloadFile(file.id, file.name);
      if (result.success) {
        showSnackbar('File downloaded successfully', 'success');
      } else {
        showSnackbar('Failed to download file', 'error');
      }
    } catch (error) {
      showSnackbar('Error downloading file', 'error');
    }
    handleCloseContextMenu();
  };

  const handleRename = (file) => {
    setRenameDialog({
      open: true,
      fileId: file.id,
      currentName: file.name
    });
    setNewFileName(file.name);
    handleCloseContextMenu();
  };

  const handleRenameConfirm = async () => {
    try {
      const result = await driveService.renameFile(renameDialog.fileId, newFileName);
      if (result.success) {
        showSnackbar('File renamed successfully', 'success');
        await loadFiles();
      } else {
        showSnackbar('Failed to rename file', 'error');
      }
    } catch (error) {
      showSnackbar('Error renaming file', 'error');
    }
    setRenameDialog({ open: false, fileId: '', currentName: '' });
  };

  const handleDelete = async (file) => {
    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      try {
        const result = await driveService.deleteFile(file.id);
        if (result.success) {
          showSnackbar('File deleted successfully', 'success');
          await loadFiles();
        } else {
          showSnackbar('Failed to delete file', 'error');
        }
      } catch (error) {
        showSnackbar('Error deleting file', 'error');
      }
    }
    handleCloseContextMenu();
  };

  const handleShare = (file) => {
    // Copy share link to clipboard
    navigator.clipboard.writeText(file.webViewLink);
    showSnackbar('Share link copied to clipboard', 'success');
    handleCloseContextMenu();
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await driveService.uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        showSnackbar('File uploaded successfully', 'success');
        await loadFiles();
      } else {
        showSnackbar('Failed to upload file', 'error');
      }
    } catch (error) {
      showSnackbar('Error uploading file', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (mimeType) => {
    const iconType = driveService.getFileIcon(mimeType);
    const iconProps = { sx: { fontSize: 24 } };
    
    switch (iconType) {
      case 'folder': return <FolderIcon {...iconProps} />;
      case 'image': return <ImageIcon {...iconProps} />;
      case 'video': return <VideoFileIcon {...iconProps} />;
      case 'audio': return <AudioFileIcon {...iconProps} />;
      case 'picture_as_pdf': return <PictureAsPdfIcon {...iconProps} />;
      case 'description': return <DescriptionIcon {...iconProps} />;
      case 'table_chart': return <TableChartIcon {...iconProps} />;
      case 'slideshow': return <SlideshowIcon {...iconProps} />;
      case 'text_snippet': return <TextSnippetIcon {...iconProps} />;
      default: return <InsertDriveFileIcon {...iconProps} />;
    }
  };

  const getFileColor = (mimeType) => {
    if (mimeType.includes('folder')) return '#ffa726';
    if (mimeType.includes('image')) return '#4caf50';
    if (mimeType.includes('video')) return '#f44336';
    if (mimeType.includes('audio')) return '#9c27b0';
    if (mimeType.includes('pdf')) return '#f44336';
    if (mimeType.includes('word') || mimeType.includes('document')) return '#2196f3';
    if (mimeType.includes('sheet') || mimeType.includes('spreadsheet')) return '#4caf50';
    if (mimeType.includes('presentation') || mimeType.includes('slides')) return '#ff9800';
    return '#757575';
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isSignedIn) {
    return (
      <Box sx={{ p: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Google Drive
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Connect your Google Drive to manage files, upload documents, and collaborate
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              onClick={handleSignIn}
              disabled={isLoading}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign in with Google Drive'}
            </Button>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mt: 3, maxWidth: 400, mx: 'auto' }}
              >
                {error}
              </Alert>
            )}
          </Paper>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={userProfile?.imageUrl}
                sx={{ 
                  width: 48, 
                  height: 48, 
                  mr: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {userProfile?.name ? getInitials(userProfile.name) : <CloudUploadIcon />}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Google Drive
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {userProfile?.email}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Upload File">
                <span>
                  <IconButton
                    onClick={handleUpload}
                    disabled={uploading}
                    sx={{
                      background: '#f8fafc',
                      '&:hover': { background: '#e2e8f0' }
                    }}
                  >
                    <UploadIcon sx={{ color: '#6366f1' }} />
                  </IconButton>
                </span>
              </Tooltip>
              
              <Tooltip title="Refresh">
                <span>
                  <IconButton
                    onClick={loadFiles}
                    disabled={refreshing}
                    sx={{
                      background: '#f8fafc',
                      '&:hover': { background: '#e2e8f0' }
                    }}
                  >
                    <RefreshIcon sx={{ 
                      color: '#6366f1',
                      animation: refreshing ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }} />
                  </IconButton>
                </span>
              </Tooltip>
              
              <Tooltip title="Sign Out">
                <span>
                  <IconButton
                    onClick={handleSignOut}
                    disabled={isLoading}
                    sx={{
                      background: '#fef2f2',
                      '&:hover': { background: '#fee2e2' }
                    }}
                  >
                    <LogoutIcon sx={{ color: '#dc2626' }} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          
          <Divider />
        </Box>

        {/* Upload Progress */}
        {uploading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              Uploading... {uploadProgress}%
            </Typography>
          </Box>
        )}

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Breadcrumb Navigation */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            {folderPath.length > 1 && (
              <IconButton
                size="small"
                onClick={handleFolderBack}
                sx={{
                  backgroundColor: '#f3f4f6',
                  '&:hover': { backgroundColor: '#e5e7eb' }
                }}
              >
                <ExpandLessIcon sx={{ transform: 'rotate(90deg)' }} />
              </IconButton>
            )}
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              {folderPath.map((folder, index) => (
                <span key={folder.id}>
                  {index > 0 && ' > '}
                  <span style={{ 
                    color: index === folderPath.length - 1 ? '#111827' : '#6b7280',
                    fontWeight: index === folderPath.length - 1 ? 600 : 400
                  }}>
                    {folder.name}
                  </span>
                </span>
              ))}
            </Typography>
          </Stack>
        </Box>

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Box>

        {/* Files List */}
        <AnimatePresence>
          {filteredFiles.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Stack spacing={1}>
                {filteredFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          elevation: 1,
                          borderColor: '#9ca3af',
                        },
                      }}
                      onClick={() => handleFileClick(file)}
                      onContextMenu={(e) => handleContextMenu(e, file)}
                    >
                      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {/* File Icon */}
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '8px',
                              backgroundColor: getFileColor(file.mimeType),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              flexShrink: 0,
                            }}
                          >
                            {getFileIcon(file.mimeType)}
                          </Box>

                          {/* File Content */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography
                                variant="subtitle2"
                                component="div"
                                sx={{
                                  fontWeight: 600,
                                  color: '#111827',
                                  fontSize: '0.9rem',
                                  flex: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {file.name}
                              </Typography>
                              
                              {file.mimeType.includes('folder') && (
                                <Chip
                                  label="Folder"
                                  size="small"
                                  sx={{
                                    backgroundColor: '#ffa726',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    height: 18,
                                    fontWeight: 500,
                                  }}
                                />
                              )}
                            </Box>

                            <Typography
                              variant="body2"
                              component="div"
                              sx={{
                                color: '#64748b',
                                fontSize: '0.85rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {file.size ? driveService.formatFileSize(file.size) : 'Folder'}
                            </Typography>
                          </Box>

                          {/* Time */}
                          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#6b7280',
                                fontSize: '0.75rem',
                                display: 'block',
                              }}
                            >
                              {driveService.formatDate(file.modifiedTime)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          ) : !refreshing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed #e2e8f0',
                  borderRadius: 2,
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  No files found
                </Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                  {searchQuery ? 'No files match your search.' : 'Your Drive appears to be empty or there was an error loading files.'}
                </Typography>
              </Paper>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Loading State */}
        {refreshing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        {/* Context Menu */}
        <Menu
          open={contextMenu !== null}
          onClose={handleCloseContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={() => handleFileClick(selectedFile)}>
            <VisibilityIcon sx={{ mr: 1 }} />
            Open
          </MenuItem>
          <MenuItem onClick={() => handleDownload(selectedFile)}>
            <DownloadIcon sx={{ mr: 1 }} />
            Download
          </MenuItem>
          <MenuItem onClick={() => handleRename(selectedFile)}>
            <EditIcon sx={{ mr: 1 }} />
            Rename
          </MenuItem>
          <MenuItem onClick={() => handleShare(selectedFile)}>
            <ShareIcon sx={{ mr: 1 }} />
            Share
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleDelete(selectedFile)} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Rename Dialog */}
        <Dialog open={renameDialog.open} onClose={() => setRenameDialog({ open: false, fileId: '', currentName: '' })}>
          <DialogTitle>Rename File</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="File Name"
              fullWidth
              variant="outlined"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRenameDialog({ open: false, fileId: '', currentName: '' })}>
              Cancel
            </Button>
            <Button onClick={handleRenameConfirm} variant="contained">
              Rename
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Box>
  );
};

export default GoogleDrive;

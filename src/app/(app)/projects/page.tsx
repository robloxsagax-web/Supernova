'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Folder, Plus, Download, Trash2, Search, Filter, Image as ImageIcon, Calendar, Clock, ChevronDown, Loader2, ExternalLink, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { storageService, CampaignMetadata } from '@/lib/storage';

type SortBy = 'newest' | 'oldest' | 'title';
type SortOrder = 'asc' | 'desc';

export default function ProjectsPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { b2Campaigns, b2Loading, b2Error, loadB2Campaigns, deleteCampaignFromB2 } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Load campaigns on mount
  useEffect(() => {
    if (isLoggedIn) {
      console.log('[Gallery] Loading campaigns from B2...');
      loadB2Campaigns()
        .then(() => {
          console.log('[Gallery] Campaigns loaded successfully, count:', b2Campaigns.length);
        })
        .catch((error) => {
          console.error('[Gallery] Failed to load campaigns:', error);
        });
    }
  }, [isLoggedIn, loadB2Campaigns]);

  // Auth protection
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/auth');
    }
  }, [authLoading, isLoggedIn, router]);

  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    let campaigns = [...b2Campaigns];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      campaigns = campaigns.filter(c => 
        c.product_title?.toLowerCase().includes(query) ||
        c.product_description?.toLowerCase().includes(query) ||
        c.prompt?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      campaigns = campaigns.filter(c => c.status === statusFilter);
    }

    // Sort
    campaigns.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title':
          return (a.product_title || '').localeCompare(b.product_title || '');
        default:
          return 0;
      }
    });

    return campaigns;
  }, [b2Campaigns, searchQuery, sortBy, statusFilter]);

  const handleDelete = async (campaignId: string) => {
    console.log('[Gallery] Delete requested for campaign:', campaignId);
    
    if (!confirm('Are you sure you want to delete this campaign? This cannot be undone.')) {
      console.log('[Gallery] Delete cancelled by user');
      return;
    }

    setDeletingId(campaignId);
    console.log('[Gallery] Deleting campaign:', campaignId);
    
    try {
      await deleteCampaignFromB2(campaignId);
      console.log('[Gallery] Campaign deleted successfully:', campaignId);
    } catch (error) {
      console.error('[Gallery] Failed to delete campaign:', error);
      alert('Failed to delete campaign. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (campaignId: string) => {
    console.log('[Gallery] Download requested for campaign:', campaignId);
    
    try {
      console.log('[Gallery] Starting ZIP download for:', campaignId);
      const blob = await storageService.downloadCampaignZip(campaignId);
      console.log('[Gallery] ZIP received, size:', blob.size, 'bytes');
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campaign-${campaignId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('[Gallery] Download completed for:', campaignId);
    } catch (error) {
      console.error('[Gallery] Failed to download:', error);
      alert('Failed to download campaign. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString.startsWith('_')) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatDuration = (ms: number) => {
    if (!ms) return 'N/A';
    const seconds = Math.round(ms);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] opacity-50 blur-sm animate-pulse" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] p-[2px]">
            <div className="w-full h-full rounded-full bg-[#09090B]" />
          </div>
        </div>
      </div>
    );
  }

  // Don't Render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Gallery
            </h1>
            <p className="text-muted-foreground">
              View and manage your generated campaigns
            </p>
          </div>
          <button 
            onClick={() => router.push('/create')}
            className="px-6 py-3 rounded-xl gradient-primary text-background font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-peach/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="h-12 px-4 pr-10 rounded-xl bg-white/5 border border-border text-foreground focus:outline-none focus:border-peach/50 transition-all appearance-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Filter */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-12 px-4 rounded-xl border transition-all flex items-center gap-2 ${
              showFilters || statusFilter !== 'all'
                ? 'bg-primary/10 border-primary/50 text-primary'
                : 'bg-white/5 border-border text-foreground hover:border-peach/50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-6 rounded-2xl glass border border-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-border text-foreground focus:outline-none focus:border-peach/50 transition-all"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="uploading">Uploading</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found
        </div>

        {/* Loading State */}
        {b2Loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading campaigns...</span>
          </div>
        )}

        {/* Error State */}
        {b2Error && (
          <div className="p-6 rounded-2xl bg-error/10 border border-error/20 text-error">
            <p className="font-medium mb-2">Failed to load campaigns</p>
            <p className="text-sm opacity-80">{b2Error}</p>
            <button
              onClick={() => loadB2Campaigns()}
              className="mt-4 px-4 py-2 rounded-lg bg-error/20 hover:bg-error/30 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!b2Loading && !b2Error && filteredCampaigns.length === 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-primary flex items-center justify-center">
              <Folder className="w-10 h-10 text-peach" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {searchQuery ? 'No campaigns found' : 'No campaigns yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search or filters'
                : 'Start creating campaigns to see them here'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push('/create')}
                className="px-6 py-3 rounded-xl gradient-primary text-background font-semibold hover:opacity-90 transition-opacity"
              >
                Create Your First Campaign
              </button>
            )}
          </motion.div>
        )}

        {/* Campaigns Grid */}
        {!b2Loading && !b2Error && filteredCampaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.campaign_id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-2xl glass border border-border hover:border-peach/50 transition-all group"
              >
                {/* Thumbnail */}
                <div className="w-full h-40 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 overflow-hidden">
                  {campaign.image_count > 0 ? (
                    <ImageIcon className="w-12 h-12 text-primary" />
                  ) : (
                    <Folder className="w-12 h-12 text-primary" />
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                  {campaign.product_title || 'Untitled Campaign'}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {campaign.product_description || 'No description'}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(campaign.created_at)}
                  </div>
                  {campaign.generation_time > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(campaign.generation_time)}
                    </div>
                  )}
                  {campaign.image_count > 0 && (
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      {campaign.image_count} image{campaign.image_count !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'completed' 
                      ? 'bg-green-500/10 text-green-500'
                      : campaign.status === 'uploading'
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : campaign.status === 'failed'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {campaign.status || 'unknown'}
                  </div>
                  {campaign.ai_provider && (
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {campaign.ai_provider}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(campaign.campaign_id)}
                    className="flex-1 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors text-primary font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(campaign.campaign_id)}
                    disabled={deletingId === campaign.campaign_id}
                    className="h-10 w-10 rounded-xl bg-error/10 hover:bg-error/20 transition-colors text-error flex items-center justify-center"
                  >
                    {deletingId === campaign.campaign_id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

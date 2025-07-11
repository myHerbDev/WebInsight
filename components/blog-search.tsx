"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  category: string
  tags: string[]
  featured: boolean
}

interface BlogSearchProps {
  posts: BlogPost[]
  onFilteredPosts: (posts: BlogPost[]) => void
}

export function BlogSearch({ posts, onFilteredPosts }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTag, setSelectedTag] = useState("")

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((post) => post.category)))
    return cats.map((cat) => ({
      name: cat,
      count: posts.filter((post) => post.category === cat).length,
    }))
  }, [posts])

  const tags = useMemo(() => {
    const allTags = posts.flatMap((post) => post.tags)
    const uniqueTags = Array.from(new Set(allTags))
    return uniqueTags.map((tag) => ({
      name: tag,
      count: posts.filter((post) => post.tags.includes(tag)).length,
    }))
  }, [posts])

  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag))
    }

    return filtered
  }, [posts, searchQuery, selectedCategory, selectedTag])

  // Update parent component with filtered posts
  useMemo(() => {
    onFilteredPosts(filteredPosts)
  }, [filteredPosts, onFilteredPosts])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedTag("")
  }

  const hasActiveFilters = searchQuery.trim() || selectedCategory !== "all" || selectedTag

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles, authors, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          >
            <option value="all">All Categories ({posts.length})</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Popular Tags */}
      <div>
        <h3 className="text-sm font-medium mb-3">Popular Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 10).map((tag) => (
            <Badge
              key={tag.name}
              variant={selectedTag === tag.name ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedTag(selectedTag === tag.name ? "" : tag.name)}
            >
              {tag.name} ({tag.count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Search Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredPosts.length} of {posts.length} articles
        </span>
        {hasActiveFilters && (
          <span className="text-primary">
            {searchQuery && `"${searchQuery}"`}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
            {selectedTag && ` tagged with "${selectedTag}"`}
          </span>
        )}
      </div>

      {/* No Results */}
      {filteredPosts.length === 0 && hasActiveFilters && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

import { useState } from "react";
import {
  FileText,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { useAIStore, MessageSummary } from "@/stores/aiStore";

interface MessageSummarizerProps {
  chatId: string;
  messages: string[];
}

export default function MessageSummarizer({
  chatId,
  messages,
}: MessageSummarizerProps) {
  const {
    messageSummaries,
    isGeneratingSummary,
    generateMessageSummary,
    aiSettings,
  } = useAIStore();

  const [showSummary, setShowSummary] = useState(false);

  const chatSummaries = messageSummaries.filter(
    (summary) => summary.chatId === chatId
  );
  const latestSummary = chatSummaries[chatSummaries.length - 1];

  if (!aiSettings.autoSummarizeEnabled) {
    return null;
  }

  const handleGenerateSummary = async () => {
    if (messages.length > 0) {
      await generateMessageSummary(chatId, messages);
      setShowSummary(true);
    }
  };

  const getSentimentIcon = (sentiment: MessageSummary["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "negative":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: MessageSummary["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "negative":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-800";
    }
  };

  return (
    <div className="relative">
      {/* Summarize Button */}
      <button
        onClick={handleGenerateSummary}
        disabled={isGeneratingSummary || messages.length === 0}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGeneratingSummary ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        <span>Summarize</span>
      </button>

      {/* Summary Panel */}
      {(showSummary || latestSummary) && latestSummary && (
        <div className="absolute bottom-full right-0 mb-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Message Summary
              </h3>
            </div>
            {showSummary && (
              <div>
                <p>Showing summary</p>
                <button onClick={() => setShowSummary(false)}>Close</button>
              </div>
            )}
            <button
              onClick={() => setShowSummary(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close Summary"
              title="Close Summary"
            >
              ×
            </button>
          </div>

          {/* Summary Content */}
          <div className="space-y-4">
            {/* Main Summary */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Summary
              </h4>
              <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                {latestSummary.summary}
              </p>
            </div>

            {/* Key Points */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Key Points
              </h4>
              <ul className="space-y-1">
                {latestSummary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sentiment */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Sentiment:
                </span>
                <div
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(
                    latestSummary.sentiment
                  )}`}
                >
                  {getSentimentIcon(latestSummary.sentiment)}
                  <span className="capitalize">{latestSummary.sentiment}</span>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {latestSummary.createdAt.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Generate New Summary */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              {isGeneratingSummary ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              <span>Generate New Summary</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

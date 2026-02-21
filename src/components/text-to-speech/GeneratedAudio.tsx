"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useGeneratedStore from "@/store/useGeneratedStore";
import { Download, Loader, Share2, Volume2 } from "lucide-react";
import * as motion from "motion/react-client";

const GeneratedAudio = () => {
  const { generatedAudio, loading } = useGeneratedStore();

  const downloadAudio = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `generated-speech-${Date.now()}.mp3`; // Or wav, depending on the model's actual output
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (!generatedAudio) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl relative z-10 w-full lg:w-[500px] xl:w-[600px] h-[300px] mx-auto flex">
          <CardContent className="flex w-full items-center justify-center p-8 m-auto">
            <div className="text-center w-full">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader className="animate-spin text-blue-400 w-12 h-12" />
                  <div className="text-white text-lg font-medium">
                    Generating audio...
                  </div>
                  <div className="text-gray-400 text-sm">
                    Bu işlem birkaç saniye sürebilir
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                    <Volume2 className="text-white w-10 h-10" />
                  </div>
                  <div className="text-white text-xl font-semibold mb-2">
                    Your audio will appear here
                  </div>
                  <div className="text-gray-400 text-sm max-w-sm text-center">
                    Enter text and click "Generate Audio" button to start
                    creating speech with AI
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full lg:w-[500px] xl:w-[600px] mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col items-center min-h-[300px] justify-center">
        <div className="w-full flex items-center justify-between mb-8">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            ✨ Generated Audio
          </h3>
        </div>

        <div className="w-full bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Volume2 className="w-8 h-8" />
          </div>

          <audio controls className="w-full" src={generatedAudio}>
            Your browser does not support the audio element.
          </audio>

          <div className="flex gap-4 w-full justify-center">
            <Button
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => downloadAudio(generatedAudio)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" className="w-1/2 border-gray-200">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GeneratedAudio;

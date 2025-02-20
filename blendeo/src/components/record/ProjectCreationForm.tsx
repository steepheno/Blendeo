import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useVideoStore from "@/stores/videoStore";
import { instruments } from "@/assets/data/instruments"; // 악기 데이터 import
import { MoveLeft } from "lucide-react";

interface CreateProjectRequest {
  title: string;
  content: string;
  forkProjectId?: number | undefined;
  state: boolean;
  instrumentIds: number[];
  videoUrl: string;
}

const ProjectCreationForm = () => {
  const navigate = useNavigate();
  const { uploadProject, createdUrl } = useVideoStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateProjectRequest>({
    title: "",
    content: "",
    state: true,
    instrumentIds: [],
    videoUrl: createdUrl,
  });

  const backToRecord = () => {
    navigate("/seed/record");
  }

  useEffect(() => {
    if (!createdUrl) {
      navigate("/main");
    }
  }, [createdUrl, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const projectId = await uploadProject(formData);
      if (projectId) {
        navigate(`/project/${projectId}`);
      }
    } catch (error) {
      console.error("Project creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div onClick={backToRecord} className="mt-10 ml-10 flex items-center cursor-pointer">
        <div><MoveLeft color='#FFFFFF' /></div>
        <div className="ml-5 text-white">
          다시 촬영하기
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mx-auto p-4 mt-8 max-w-2xl">
        <Card className="flex flex-col bg-[#171226] border border-[#171226] w-full">
          <CardHeader className="mb-20">
            <CardTitle className="text-5xl font-bold text-white text-center mb-2">
              새 프로젝트 만들기
            </CardTitle>
            <CardDescription className="text-white flex justify-center">
              촬영한 영상의 제목과 설명을 입력해주세요!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                className="data-[state=checked]:bg-[#6A02FA]"
                id="state"
                checked={formData.state}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, state: checked })
                }
              />
              <span className="text-sm text-gray-500">
                {formData.state ? "공개" : "비공개"}
              </span>
            </div>
            <div className="space-y-2">
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="프로젝트 제목"
                required
                className="bg-[#231E31] border-[#454151] text-[#A7A5AD] focus:border-violet-400"
              />
            </div>

            <div className="space-y-2">
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="프로젝트 설명"
                required
                className="min-h-[120px] bg-[#231E31] border-[#454151] text-[#A7A5AD] focus:border-violet-400 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Select
                value={formData.instrumentIds[0]?.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    instrumentIds: [parseInt(value)],
                  })
                }
              >
                <SelectTrigger className="bg-[#231E31] border-[#454151] text-[#A7A5AD]">
                  <SelectValue placeholder="사용된 악기 >" />
                </SelectTrigger>
                <SelectContent>
                  {instruments.map((instrument) => (
                    <SelectItem
                      key={instrument.id}
                      value={instrument.id.toString()}
                    >
                      {instrument.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 w-full">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-color1 to-color2 hover:opacity-90 text-white w-full"
              >
                {isSubmitting ? "생성 중..." : "업로드하기"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ProjectCreationForm;

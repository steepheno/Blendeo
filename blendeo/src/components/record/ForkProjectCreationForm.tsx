import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import useForkVideoStore from "@/stores/forkVideoStore";
import { instruments } from "@/assets/data/instruments";
import { MoveLeft } from "lucide-react";

interface CreateProjectRequest {
  title: string;
  content: string;
  forkProjectId: number | undefined;
  state: boolean;
  instrumentIds: number[];
  videoUrl: string;
}

const ForkProjectCreationForm = () => {
  const navigate = useNavigate();
  const { uploadProject, createdUrl, originalProjectData } =
    useForkVideoStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateProjectRequest>({
    title: "",
    content: "",
    forkProjectId: originalProjectData?.projectId,
    state: true,
    instrumentIds: [], // 빈 배열로 초기화
    videoUrl: createdUrl,
  });

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

  const backToRecord = () => {
    navigate("/seed/record");
  }

  return (
    <div>
      <div onClick={backToRecord} className="mt-10 ml-10 flex items-center cursor-pointer">
        <div><MoveLeft color='#FFFFFF' /></div>
        <div className="ml-5 text-white">
          다시 촬영하기
        </div>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto p-4">
        <Card>
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

export default ForkProjectCreationForm;

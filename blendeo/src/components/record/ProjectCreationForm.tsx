import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useVideoStore from "@/stores/videoStore";
// import { CreateProjectRequest } from "@/types/api/project"; // 임시로 instrumentsId가 필수인 type 사용
import { instruments } from "@/assets/data/instruments"; // 악기 데이터 import

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

  useEffect(() => {
    if (!createdUrl) {
      navigate("/");
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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto p-4 mt-14"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-violet-600">
            새 프로젝트 만들기
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">프로젝트 제목</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="프로젝트 제목을 입력하세요"
              required
              className="border-violet-200 focus:border-violet-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">프로젝트 설명</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="프로젝트에 대해 설명해주세요"
              required
              className="min-h-[120px] border-violet-200 focus:border-violet-400"
            />
          </div>

          <div className="space-y-2">
            <Label>사용된 악기</Label>
            {/* 이후 그 외 기타 악기 추가할 수 있도록 수정 필요 */}
            <Select
              value={formData.instrumentIds[0]?.toString()}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  instrumentIds: [parseInt(value)],
                })
              }
            >
              <SelectTrigger className="border-violet-200">
                <SelectValue placeholder="악기를 선택하세요" />
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

          <div className="flex items-center space-x-2">
            <Label htmlFor="state">공개 여부</Label>
            <Switch
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

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)} // router.back() 대신 navigate(-1) 사용
              className="border-violet-600 text-violet-600 hover:bg-violet-50"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              {isSubmitting ? "생성 중..." : "프로젝트 생성"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProjectCreationForm;

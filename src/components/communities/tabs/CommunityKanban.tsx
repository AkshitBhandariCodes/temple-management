import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { Community } from "../types";
import { useCommunityTasks, useUpdateTask } from "@/hooks/use-communities";
import { formatDistanceToNow } from "date-fns";

interface CommunityKanbanProps {
	community: Community;
}

const COLUMNS = [
	{ id: "todo", title: "To Do", color: "bg-slate-100" },
	{ id: "in_progress", title: "In Progress", color: "bg-blue-100" },
	{ id: "review", title: "Review", color: "bg-yellow-100" },
	{ id: "completed", title: "Completed", color: "bg-green-100" },
];

export const CommunityKanban = ({ community }: CommunityKanbanProps) => {
	const [draggedTask, setDraggedTask] = useState<any>(null);

	const { data: allTasks, isLoading } = useCommunityTasks(community.id);
	const updateTask = useUpdateTask();

	const getTasksByStatus = (status: string) => {
		return allTasks?.filter((task: any) => task.status === status) || [];
	};

	const handleDragStart = (task: any) => {
		setDraggedTask(task);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleDrop = async (newStatus: string) => {
		if (!draggedTask || draggedTask.status === newStatus) {
			setDraggedTask(null);
			return;
		}

		const taskId = draggedTask.id || draggedTask._id;

		if (!taskId) {
			console.error("Invalid task ID:", taskId);
			console.error("Task object:", draggedTask);
			alert("Error: Invalid task ID. Please refresh the page and try again.");
			setDraggedTask(null);
			return;
		}

		try {
			await updateTask.mutateAsync({
				communityId: community.id,
				taskId: taskId,
				status: newStatus,
			});
		} catch (error) {
			console.error("Failed to update task:", error);
			alert("Failed to update task. Please try again.");
		}

		setDraggedTask(null);
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "urgent":
				return "destructive";
			case "high":
				return "default";
			case "medium":
				return "secondary";
			case "low":
				return "outline";
			default:
				return "outline";
		}
	};

	if (isLoading) {
		return (
			<Card>
				<CardContent className="p-8 text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
					<p className="mt-4 text-muted-foreground">Loading kanban board...</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Task Board</h2>
				<Badge variant="outline">{allTasks?.length || 0} Total Tasks</Badge>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{COLUMNS.map((column) => {
					const tasks = getTasksByStatus(column.id);

					return (
						<div
							key={column.id}
							className="flex flex-col h-full"
							onDragOver={handleDragOver}
							onDrop={() => handleDrop(column.id)}>
							<Card className={`flex-1 ${column.color}`}>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<CardTitle className="text-sm font-medium">
											{column.title}
										</CardTitle>
										<Badge variant="secondary" className="text-xs">
											{tasks.length}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-3">
									{tasks.map((task: any) => (
										<Card
											key={task.id || task._id}
											draggable
											onDragStart={() => handleDragStart(task)}
											className="cursor-move hover:shadow-md transition-shadow bg-white">
											<CardContent className="p-4">
												<div className="space-y-3">
													<div className="flex items-start justify-between gap-2">
														<h3 className="font-medium text-sm line-clamp-2">
															{task.title}
														</h3>
														<Badge
															variant={getPriorityColor(task.priority)}
															className="text-xs shrink-0">
															{task.priority}
														</Badge>
													</div>

													{task.description && (
														<p className="text-xs text-muted-foreground line-clamp-2">
															{task.description}
														</p>
													)}

													<div className="flex items-center justify-between text-xs text-muted-foreground">
														{task.due_date && (
															<span>
																Due{" "}
																{formatDistanceToNow(new Date(task.due_date), {
																	addSuffix: true,
																})}
															</span>
														)}
														{task.assigned_to &&
															task.assigned_to.length > 0 && (
																<div className="flex -space-x-2">
																	{task.assigned_to
																		.slice(0, 3)
																		.map((user: any, idx: number) => (
																			<Avatar
																				key={idx}
																				className="w-6 h-6 border-2 border-white">
																				<AvatarFallback className="text-xs">
																					{user.full_name
																						?.substring(0, 2)
																						.toUpperCase() || "U"}
																				</AvatarFallback>
																			</Avatar>
																		))}
																	{task.assigned_to.length > 3 && (
																		<Avatar className="w-6 h-6 border-2 border-white">
																			<AvatarFallback className="text-xs">
																				+{task.assigned_to.length - 3}
																			</AvatarFallback>
																		</Avatar>
																	)}
																</div>
															)}
													</div>

													{task.tags && task.tags.length > 0 && (
														<div className="flex gap-1 flex-wrap">
															{task.tags
																.slice(0, 2)
																.map((tag: string, idx: number) => (
																	<Badge
																		key={idx}
																		variant="outline"
																		className="text-xs">
																		{tag}
																	</Badge>
																))}
															{task.tags.length > 2 && (
																<Badge variant="outline" className="text-xs">
																	+{task.tags.length - 2}
																</Badge>
															)}
														</div>
													)}
												</div>
											</CardContent>
										</Card>
									))}

									{tasks.length === 0 && (
										<div className="text-center py-8 text-muted-foreground text-sm">
											<p>No tasks</p>
											<p className="text-xs mt-1">Drag tasks here</p>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					);
				})}
			</div>

			{/* Drag Instruction */}
			<Card className="mt-4 bg-blue-50 border-blue-200">
				<CardContent className="p-4">
					<p className="text-sm text-blue-900">
						💡 <strong>Tip:</strong> Drag and drop tasks between columns to
						update their status. Changes are saved automatically!
					</p>
				</CardContent>
			</Card>

			{allTasks?.length === 0 && (
				<Card>
					<CardContent className="p-12 text-center">
						<div className="text-muted-foreground">
							<Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
							<p className="text-lg font-medium">No tasks yet</p>
							<p className="text-sm mt-2">
								Go to the Tasks tab to create your first task!
							</p>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};
